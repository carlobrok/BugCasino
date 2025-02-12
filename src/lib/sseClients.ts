"use server"


// Wir speichern hier pro User die zugehörigen SSE-Writer. Falls ein User mehrere Verbindungen hat,
// könntest du hier auch Arrays verwenden.
const sseClients = new Map<number, WritableStreamDefaultWriter<Uint8Array>>();

export async function registerClient(userId: number, writer: WritableStreamDefaultWriter<Uint8Array>) {
    sseClients.set(userId, writer);
}

export async function unregisterClient(userId: number) {
    sseClients.delete(userId);
}

/**
 * Sendet ein Objekt als SSE-Nachricht an den Client, der über die userId registriert wurde.
 */
export async function sendNotification (userId: number, data: any) {
    const writer = sseClients.get(userId);
    if (!writer) {
        console.warn(`Kein SSE-Client für userId ${userId} registriert.`);
        return null;
    }
    // SSE-Nachrichten müssen im Format "data: <Daten als JSON>\n\n" gesendet werden.
    const message = `data: ${JSON.stringify(data)}\n\n`;
    writer.write(new TextEncoder().encode(message));
}
