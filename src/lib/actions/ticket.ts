"use server";

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";
import { getBetReward, getTicketReward } from "@/lib/actions/scoring"
import { createTransaction, TransactionType } from "../transaction";

export async function closeUserTicket() {
  const user: User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  const ticket = await prisma.ticket.findFirst({
    include: {
      bets: { select: { id: true, userId: true, doneInTime: true, amount: true } },
    },
    where: { authorId: user.id, open: true },
  });

  if (!ticket) {
    return null;
  }

  const now = new Date();
  const doneInTime = ticket.timeEstimate > now;

  console.log("Closing ticket", ticket);
  console.log("Done in time", doneInTime);

  for (const bet of ticket.bets) {
    const correctBet = bet.doneInTime === doneInTime;
    console.log("Bet", bet, "is correct", correctBet);
    const betReward = getBetReward(bet.amount, correctBet);

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

  await createTransaction({ userId: user.id, amount: getTicketReward(ticket.createdAt), type: TransactionType.PAYOUT });

  // Return the result of updating the ticket(s)
  return await prisma.ticket.update({
    where: { id: ticket.id },
    data: { open: false },
  });
}
