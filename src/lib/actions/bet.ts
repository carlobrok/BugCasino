'use server'

import { prisma } from "../prisma";
import { getCurrentUser } from "../session";
import type { User } from "@prisma/client";


export async function createBet(ticketId: number, amount: number, doneInTime: boolean) {
    const user: User | null = await getCurrentUser();

    if (!user) {
        return null;
    }

    // check if the user has enough score
    if (user.score < amount) {
        throw new Error("Not enough score");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { score: { decrement: amount } },
    });

    // Return the result of updating the ticket(s)
    return await prisma.bet.create({
        data: {
            amount,
            ticketId,
            userId: user.id,
            doneInTime,
        },
    });
}
