import { prisma } from "@/lib/prisma";

export enum TransactionType {
    BET = "BET",
    PAYOUT = "PAYOUT",
}

export async function createTransaction({userId, amount, type} : {userId: number, amount: number, type: TransactionType}) {
    
    // substract the amount from the user's balance and create a new bet transaction
    if (type === TransactionType.BET) {
        await prisma.user.update({
            where: { id: userId },
            data: { score: { decrement: amount } },
        });

        await prisma.transaction.create({
            data: {
                amount,
                userId,
                type: TransactionType.BET,
            }
        });

    } 

    // create a new payout transaction and add the amount to the user's balance
    else if (type === TransactionType.PAYOUT) {

        await prisma.user.update({
            where: { id: userId },
            data: { score: { increment: amount } },
        });

        await prisma.transaction.create({
            data: {
                amount,
                userId,
                type: TransactionType.PAYOUT,
            }
        });
    }
}

export async function getUserTransactions({userId} : {userId: number}) {
    return await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}
