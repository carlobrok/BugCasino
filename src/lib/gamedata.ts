import { only } from "node:test";
import { prisma } from "./prisma";
import { getCurrentUser } from "./session";
import { Ticket, User } from "@prisma/client";

/**
 * @returns All tickets of the current user or null if not authenticated.
 */
export async function getUserTickets(onlyClosed: boolean = false) : Promise<Ticket | Ticket[] | null> {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  const schema = {
    include: {
      author: {
        select: { name: true },
      },
    },
    where: { authorId: user.id, open: onlyClosed ? false : undefined },
  }

  return await prisma.ticket.findMany(schema) as Ticket[];
}

export async function getOpenUserTicket() : Promise<Ticket | null> {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  const schema = {
    include: {
      author: {
        select: { name: true },
      },
    },
    where: { authorId: user.id, open: true },
  }

  return await prisma.ticket.findFirst(schema) as Ticket;
}



export async function getOtherTickets(onlyOpen: boolean = false) {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  return await prisma.ticket.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
    where: { authorId: { not: user.id } },
  });
}

export async function getTicketDetails(ticketId: number) {
  return await prisma.ticket.findUnique({
    include: {
      bets: {
        select: {
          user: {
            select: { name: true },
          },
          timeBet: true,
          amount: true,
        },
      },
    },
    where: {
      id: ticketId,
    },
  });
}