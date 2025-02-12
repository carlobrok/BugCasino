// app/api/sse/route.ts
import { NextResponse } from "next/server";
import { registerClient } from "@/lib/sseClients";
import { getCurrentSession, getCurrentUser, getUser } from "@/lib/session";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
    const user = await getCurrentUser();

    if (!user) {
        console.warn("Keine gültige Session gefunden – SSE wird abgelehnt.");
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Erzeuge einen TransformStream, um eine dauerhafte SSE-Verbindung aufzubauen
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Registriere den Client (Writer) in einer globalen Map (siehe lib/sseClients.ts)
    registerClient(user.id, writer);

    console.log("SSE-Client registriert", user.id);
    return new NextResponse(stream.readable, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
