"use client";
import { useEffect, useState } from "react";
import LoadingIndicator from "../LoadingIndicator";
// import { getUserTickets } from "@/lib/actions/gamedata";
import { Ticket } from "@/lib/actions/gamedata"

export default function TicketClosedUser({ tickets }: { tickets: Ticket[] }) {

    const [showTickets, setShowTickets] = useState(false);

    const handleClick = () => {
        setShowTickets(!showTickets);
    };

    return (
        <div className="mt-15 flex flex-col items-center">

            <button
                onClick={handleClick}
                className="bg-zinc-700/30 hover:bg-zinc-300/30 hover:cursor-pointer text-white px-4 py-2 rounded-2xl"
                >
                show my closed tickets
            </button>
            {showTickets && (
                <div>
                    {tickets.map((ticket) => (
                        <div key={ticket.id}>
                            <h3>{ticket.title}</h3>
                            <p>{ticket.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}