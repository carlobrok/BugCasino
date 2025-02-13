// lib/notifications.ts
import { prisma } from './prisma';
import type { User } from '@prisma/client';

type Bet = {
    id: number;
    userId: number;
    doneInTime: boolean;
    amount: number;
}

/**
 * Sendet eine Notification an den User, wenn das Ticket ausgewertet wurde.
 *
 * @param user - Der betroffene User (muss mindestens eine id enthalten)
 * @param bet - Das Bet-Objekt
 * @param correctBet - true, wenn der Bet als korrekt ausgewertet wurde
 */
export function ticketClosedNotification(user: User, bet: Bet, correctBet: boolean, result: number) {
    // Hier wird angenommen, dass bet.result bereits gesetzt wurde.
    const message = correctBet
        ? `Gewonnen! Dein Gewinn beträgt: ${result}.`
        : `Verloren! Das Ergebnis war: ${result}.`;

    // Baue das Notification-Objekt – du kannst es beliebig erweitern.
    const notification = {
        bet,
        result,
        message,
        createdAt: new Date(),
    };

    return notification;
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
