// app/api/sse/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getUnnotifedBets } from "@/lib/notification";


export type BetNotification = {
    message: string;
    bet: {
        id: number;
        userId: number;
        doneInTime: boolean;
        amount: number;
        result: number;
    }
    ticketAuthor: string;
    ticketId: number;
}


export async function GET(request: Request) {
    const user = await getCurrentUser();

    if (!user) {
        console.warn("");
        return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const unnotifiedBets = await getUnnotifedBets(user.id);
    

    const notifications: BetNotification[] = unnotifiedBets.map(bet => ({
        message: bet.result! > 0 ? `Gewonnen! Dein Gewinn beträgt: ${bet.result}.` : `Verloren! Das Ergebnis war: ${bet.result}.`,
        bet: {
            id: bet.id,
            userId: bet.userId,
            doneInTime: bet.doneInTime,
            amount: bet.amount,
            result: bet.result || 0,
        },
        ticketAuthor: bet.ticket.author.name,
        ticketId: bet.ticket.id,
    }));

    return new NextResponse(JSON.stringify(notifications), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
