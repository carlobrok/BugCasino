"use client";

import { useEffect, useState, useTransition } from "react";
import { closeUserTicket } from "@/lib/actions/ticket";
import { getTicketReward } from "@/lib/actions/scoring"
import { CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Amount from "../Amount";

export default function CloseTicketButton({ticketStart} : {ticketStart: Date}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [rewardAmount, setRewardAmount] = useState(0);
    
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

    // function to update the rewardAmount
    useEffect(() => {
        const updateReward = () => {
          setRewardAmount(getTicketReward(ticketStart));
        };
    
        updateReward(); // Direkt initial berechnen
        const interval = setInterval(updateReward, 5000); // Alle Sekunde updaten
    
        return () => clearInterval(interval); // Cleanup bei Unmount
      }, [ticketStart]);

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="link-green link-btn"
        >
            <span className="mr-1">Done</span>
            <Amount amount={rewardAmount}/>
            <CheckIcon className="ml-1 size-5 shrink-0" />
        </button>
    );
}
