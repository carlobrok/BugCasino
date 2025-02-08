"use server";

import { get } from "http";
import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";
import { getOpenUserTicket } from "./gamedata";
import { tree } from "next/dist/build/templates/app-page";

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

  for (const bet of ticket.bets) {
    const correctBet = bet.doneInTime === doneInTime;
    
    if (correctBet) {
      await prisma.user.update({
        where: { id: bet.userId },
        data: { score: { increment: 2 * bet.amount } },
      });
    }
  }

  console.log("Closing ticket", ticket);

  // Return the result of updating the ticket(s)
  return await prisma.ticket.update({
    where: { id: ticket.id, open: true },
    data: { open: false },
  });
}