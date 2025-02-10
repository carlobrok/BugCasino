"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

type Status = "open" | "closed" | "all";

export default function TicketStatusFilter() {
    const router = useRouter();
    // Default mode is "open"
    const [status, setStatus] = useState<Status>("all");

    const applyStatus = () => {
        // Build the new query string
        const params = new URLSearchParams(window.location.search);
        if (status === "open") {
            params.set("open", "true");
        } else if (status === "closed") {
            params.set("open", "false");
        } else {
            // For "all", remove the open parameter
            params.delete("open");
        }
        router.push(`?${params.toString()}`);
    };

    const cycleStatus = () => {
        let newStatus: Status;
        if (status === "open") {
            newStatus = "closed";
        } else if (status === "closed") {
            newStatus = "all";
        } else {
            newStatus = "open";
        }
        setStatus(newStatus);
        // applyStatus();
    };

    useEffect(() => {
        applyStatus();
    }, [status]);

    return (
        <button id="ticketstatusfilter" onClick={cycleStatus} className="px-4 py-2 bg-blue-500 rounded-lg text-sm font-semibold">
            {status === "open" && "Open Tickets"}
            {status === "closed" && "Closed Tickets"}
            {status === "all" && "All Tickets"}
        </button>
    );
}
