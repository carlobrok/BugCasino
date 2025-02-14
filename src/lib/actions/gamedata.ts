import { prisma } from "../prisma";
import { getCurrentUser, getUser } from "../session";
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

export async function getUserScore() : Promise<{name: string, userScore: number, avatar: string, closedTickets: number}> {
  const user = await getUser();

  const closedTickets = await prisma.ticket.count({
    where: { authorId: user.id, open: false },
  });

  return { name: user.name, userScore: user.score, avatar: user.avatar, closedTickets };
}

export async function getScores() {
  return await prisma.user.findMany({
    select: { name: true, score: true, id: true, avatar: true },
    orderBy: { score: "desc" },
  });
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

export interface TicketWithDetails extends Ticket {
  bets: {
    user: { name: string };
    amount: number;
    doneInTime: boolean;
    userId: number;
    id: number;
  }[];
  author: {
    name: string;
    group: {
      name: string ;
    } | null;
  };
}


export async function getOtherTickets(filters: { open?: boolean; groupName?: string } = {}) : Promise<TicketWithDetails[] | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  // Build a dynamic where clause based on the filters provided:
  const whereClause: any = {
    authorId: { not: user.id },
    ...(filters.open !== undefined ? { open: filters.open } : {}),
    ...(filters.groupName ? { author: { group: { name: filters.groupName } } } : {}),
  };

  const tickets = await prisma.ticket.findMany({
    include: {
      author: {
        select: {
          name: true,
          group: {
            select: { name: true },
          },
        },
      },
      bets: {
        select: {
          user: { select: { name: true } },
          amount: true,
          doneInTime: true,
          userId: true,
          id: true,
        },
      },
    },
    where: whereClause,
  });
  
  return tickets.sort((a, b) => {
    // 1. Open tickets should come first
    if (a.open !== b.open) return b.open ? 1 : -1;

    // // 2. Tickets where the user has NOT bet should come first
    // const aUserBet = a.bets.some((bet) => bet.userId === user.id);
    // const bUserBet = b.bets.some((bet) => bet.userId === user.id);
    // if (aUserBet !== bUserBet) return aUserBet ? 1 : -1;

    // 3. Newest tickets first (already ordered in Prisma, but kept as fallback)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  })
}


export async function getGroups() {
  return await prisma.group.findMany({
    select: { name: true, id: true },
  });
}