import { prisma } from "@/lib/prisma";

export enum TransactionType {
    BET = "BET",
    PAYOUT = "PAYOUT",
    TICKET = "TICKET",
}

export async function createTransaction({userId, amount: change, type} : {userId: number, amount: number, type: TransactionType}) {
    
    let finalBalance = -1;

    // substract the amount from the user's balance and create a new bet transaction
    if (type === TransactionType.BET) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { score: { decrement: change } },
        });

        finalBalance = user.score;
        change = -change;
    }

    // create a new payout transaction and add the amount to the user's balance
    else if (type === TransactionType.PAYOUT) {

        const user = await prisma.user.update({
            where: { id: userId },
            data: { score: { increment: change } },
        });

        finalBalance = user.score
    }

    else if (type === TransactionType.TICKET) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { score: { increment: change } },
        });

        finalBalance = user.score;
    }

    if (finalBalance === -1) {
        throw new Error("Invalid transaction type");
    }

    return await prisma.transaction.create({
        data: {
            userId,
            change,
            type,
            finalBalance,
        },
    });
}

export async function getUserTransactions({userId} : {userId: number}) {
    return await prisma.transaction.findMany({
        where: { userId },
    });
}
