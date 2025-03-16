"use client";

import { useEffect, useState, useTransition } from "react";
import { closeUserTicket } from "@/lib/actions/ticket";
import { getTicketReward, TicketReward } from "@/lib/actions/scoring"
import { CheckIcon } from "@heroicons/react/24/solid";
import Amount from "../Amount";
import { Tooltip } from "../Tooltip";

export default function CloseTicketButton({ ticketStart, ticketEnd, podAmount }: { ticketStart: Date, ticketEnd: Date, podAmount: number }) {

    const [isPending, startTransition] = useTransition();
    const [ticketReward, setTicketReward] = useState<TicketReward>({ timeReward: 0, podReward: 0 });

    async function handleClick() {
        // Start a transition so that the UI knows we're in a pending state.
        startTransition(async () => {
            try {
                await closeUserTicket();
            } catch (error) {
                console.error("Error closing ticket:", error);
            }
        });
    }


    useEffect(() => {
        setTicketReward(getTicketReward(ticketStart, ticketEnd, podAmount));
    }, [ticketStart, ticketEnd, podAmount]);


    return (
        <Tooltip
            text={
                <div>
                    <p>Reward</p>
                    <p>Working time: <Amount amount={ticketReward.timeReward} /> </p>
                    <p>Pod  bonus: <Amount amount={ticketReward.podReward} /> </p>
                </div>
            }
        >
            <button
                onClick={handleClick}
                disabled={isPending}
                className="link-green link-btn"
            >
                <span className="mr-2">Done</span>
                <Amount amount={ticketReward.podReward + ticketReward.timeReward} />
                <CheckIcon className="ml-1 size-5 shrink-0" />
            </button>
        </Tooltip>
    );
}
