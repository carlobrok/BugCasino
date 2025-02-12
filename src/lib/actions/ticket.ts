"use server";

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";
import { ticketClosedNotification } from "../notification";

function scoreUser(amount: number, doneInTime: boolean = false) {
  return doneInTime ? 2 * amount : 0;
}


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
    const result = scoreUser(bet.amount, correctBet);

    // update Bet 
    await prisma.bet.update({
      where: { id: bet.id },
      data: { result: result },
    });

    // update User score
    if (correctBet) {
      await prisma.user.update({
        where: { id: bet.userId },
        data: { score: { increment: result } },
      });
    }

    // notify user
    ticketClosedNotification(user, bet, correctBet, result);    
  }

  // Return the result of updating the ticket(s)
  return await prisma.ticket.update({
    where: { id: ticket.id, open: true },
    data: { open: false },
  });
}