"use server";

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";
import { getBetReward, getTicketReward } from "@/lib/actions/scoring"
import { createTransaction, TransactionType } from "../transaction";

export async function closeUserTicket() {
  const user: User | null = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You are not authenticated" };
  }

  const ticket = await prisma.ticket.findFirst({
    include: {
      bets: { select: { id: true, userId: true, doneInTime: true, amount: true } },
    },
    where: { authorId: user.id, open: true },
  });

  if (!ticket) {
    return { success: false, error: "You don't have an open ticket" };
  }
  
  const now = new Date();
  const doneInTime = ticket.timeEstimate > now;

  console.log("Closing ticket", ticket, "done in time", doneInTime);

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { open: false, finishedAt: now, finishedInTime: doneInTime },
  });

  

  // calculate the payout for the winners. The total pod is split between the winners, share is proportional to the amount they bet
  // get total pod and winners pod
  const totalPod = ticket.bets.reduce((acc, bet) => acc + bet.amount, 0);
  const winnersPod = ticket.bets.filter(bet => bet.doneInTime === doneInTime).reduce((acc, bet) => acc + bet.amount, 0);

  console.log("Total pod", totalPod, "Winners pod", winnersPod);

  for (const bet of ticket.bets) {
    const correctBet = bet.doneInTime === doneInTime;
    console.log("Bet", bet, "is correct", correctBet);
    
    let betReward = 0;
    if (correctBet) {
      betReward = getBetReward(bet.amount, winnersPod, totalPod);
      console.log("Bet reward", betReward);
    }

    // update Bet 
    await prisma.bet.update({
      where: { id: bet.id },
      data: { outcome: betReward },
    });

    // update User score
    if (correctBet) {
      await createTransaction({ userId: bet.userId, amount: betReward, type: TransactionType.PAYOUT });
    }
  }

  const ticketReward = getTicketReward(ticket.createdAt, now, totalPod);
  console.log("Ticket reward", ticketReward);
  const totalReward = ticketReward.timeReward + ticketReward.podReward;

  await createTransaction({ userId: user.id, amount: totalReward, type: TransactionType.TICKET });

  // Return the result of updating the ticket(s)
  return { success: true };
}
