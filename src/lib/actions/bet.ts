'use server'

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";
import { createTransaction, TransactionType } from "../transaction";

type BetResponse = {    
    success: boolean;
    error?: string;
}

export async function createBet(ticketId: number, amount: number, doneInTime: boolean) : Promise<BetResponse> {
    const user: User | null = await getCurrentUser();

    if (!user) {
        return { success: false, error: "You are not authenticated" };
    }

    // check if the user has enough score
    if (user.score < amount) {
        return { success: false, error: "You don't have enough score" };
    }

    // find the ticket in the database
    const ticket = await prisma.ticket.findUnique(
        { 
            include: {
                bets: {
                    select: { 
                        userId: true,
                    }
                }
            },
            where: { id: ticketId } 
        }
    );

    if (!ticket) {
        return { success: false, error: "Ticket not found" };
    }

    if (ticket.open === false) {
        return { success: false, error: "Ticket is closed" };
    }

    // check if user already has a ticket
    if (ticket.bets.some(bet => bet.userId === user.id)) {
        return { success: false, error: "You already have a bet on this ticket" };
    }

    try {
        await createTransaction({ userId: user.id, amount, type: TransactionType.BET });
        
        // Return the result of updating the ticket(s)
        await prisma.bet.create({
            data: {
                amount,
                ticketId,
                userId: user.id,
                doneInTime,
            },
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: "Some error occoured" };
    }
}

// gets the bet outcome for a specfic bet that the user has placed
export async function getUserBetOutcome(betId: number) {
    const user: User | null = await getCurrentUser();

    if (!user) {
        return { success: false, error: "You are not authenticated" };
    }

    const bet = await prisma.bet.findUnique({ where: { id: betId } });

    if (!bet) {
        return { success: false, error: "Bet not found" };
    }

    if (bet.userId !== user.id) {
        return { success: false, error: "You are not the owner of this bet" };
    }

    return { success: true, doneInTime: bet.doneInTime };
}