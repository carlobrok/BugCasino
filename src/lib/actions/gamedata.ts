import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import { User } from "@prisma/client";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  authorId: number;
  author: {
    name: string;
  };
  open: boolean;
  timeEstimate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserScore() : Promise<number> {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return 0;
  }

  const result = await prisma.user.findFirst({
    select: { score: true },
    where: { id: user.id },
  });

  return result?.score ?? 0;
}


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

export async function getOpenUserTicket() {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  return prisma.ticket.findFirst({
    include: {
      author: { select: { name: true } },
      bets: { select: { userId: true, id: true } },
      _count: { select: { bets: true } },
    },
    where: { authorId: user.id, open: true },
  });
}


export async function closeUserTicket() {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  prisma.ticket.updateMany({
    where: { authorId: user.id, open: true },
    data: { open: false },
  });
}


export async function getOtherTickets()  {
  const user : User | null = await getCurrentUser();

  if (!user) {
    return null;
  }

  return await prisma.ticket.findMany({
    include: {
      author: {
        select: { 
          name: true, 
          group: { 
            select: {
              name: true
            } 
          },
        }
      },
      bets: {
        select: {                       
          user: {
            select: { name: true },
          },
          amount: true,
          doneInTime: true,
          userId: true,
        }
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
          doneInTime: true,
          amount: true,
        },
      },
    },
    where: {
      id: ticketId,
    },
  });
}