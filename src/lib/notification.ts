// lib/notifications.ts
import { prisma } from './prisma';
import type { User } from '@prisma/client';

type Bet = {
    id: number;
    userId: number;
    doneInTime: boolean;
    amount: number;
}



export function getUnnotifedBets(userId: number) { 
    return prisma.bet.findMany({
        where: { userId: userId, outcome: { not: null }, notified: false },
        include: {
            ticket: {
                select: {
                    title: true,
                    id: true,
                    author: { select: { name: true } }
                }
            }
        },
    });
}
