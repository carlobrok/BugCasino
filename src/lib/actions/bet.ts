'use server'

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";

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

    // backcheck if ticket is still open
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (ticket!.open === false) {
        return { success: false, error: "Ticket is closed" };
    }

    try {
        // Decrement the user's score by the amount of the bet
        await prisma.user.update({
            where: { id: user.id },
            data: { score: { decrement: amount } },
        });
        
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
