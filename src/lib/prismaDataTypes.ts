import { Prisma } from "@prisma/client";

export const ticketBetsSelect = Prisma.validator<Prisma.TicketDefaultArgs>()({
  include: {
    bets: {
      select: {
        id: true,
        userId: true,
        doneInTime: true,
        amount: true,
      },
    },
  },
});

export type TicketBetsData = Prisma.TicketGetPayload<typeof ticketBetsSelect>;