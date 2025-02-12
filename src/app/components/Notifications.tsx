"use client";

// components/Notifications.tsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Notification = {
  bet: any; // Passe den Typ entsprechend an
  result: number;
  message: string;
  createdAt: string;
};

export default function Notifications() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Nur starten, wenn die Session geladen ist
    if (status !== "authenticated") {
      console.log("Notifications: Session not authenticated");
      return;
    }

    console.log("Notifications: Session authenticated, trying to connect to SSE");

    // Stelle die Verbindung zum SSE-Endpunkt her
    const eventSource = new EventSource("/api/sse");

    console.log("Notifications: EventSource created", eventSource);

    eventSource.onmessage = (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        setNotifications((prev) => [...prev, data]);
      } catch (error) {
        console.error("Fehler beim Parsen der Notification:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Fehler:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [status]);

  return (
    <div>
      <h2>Deine Benachrichtigungen</h2>
      {notifications.length === 0 ? (
        <p>Keine Benachrichtigungen vorhanden.</p>
      ) : (
        <ul>
          {notifications.map((n, index) => (
            <li key={index}>
              {n.message} <small>{new Date(n.createdAt).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
