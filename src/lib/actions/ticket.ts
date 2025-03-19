"use server";

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import { Prisma, type User } from "@prisma/client";
import { getBetReward, getTicketReward } from "@/lib/actions/scoring"
import { createTransaction, TransactionType } from "../transaction";
import { TicketBetsData, ticketBetsSelect } from "../prismaDataTypes";
import { createTicketRewards } from "./ticketRewards";


export async function closeUserTicket() {
  const user: User | null = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You are not authenticated" };
  }

  const ticket = await prisma.ticket.findFirst({
    ...ticketBetsSelect,
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
  
  await createTicketRewards(ticket, doneInTime, now);

  // Return the result of updating the ticket(s)
  return { success: true };
}
