"use client";

import { useEffect, useState, useTransition } from "react";
import { closeUserTicket } from "@/lib/actions/ticket";
import { getTicketReward, TicketReward } from "@/lib/actions/scoring"
import { CheckIcon } from "@heroicons/react/24/solid";
import Amount from "../Amount";
import { Tooltip } from "../Tooltip";
import { useRouter } from "next/navigation";
import { ca } from "date-fns/locale";

export default function CloseTicketButton({ ticketStart, ticketEnd, podAmount }: { ticketStart: Date, ticketEnd: Date, podAmount: number }) {

    const [isPending, setPending] = useState(false);
    const [ticketReward, setTicketReward] = useState<TicketReward>({ timeReward: 0, podReward: 0 });
    const router = useRouter();
    

    const handleClick = async () => {
        setPending(true);
        try {
            const response = await closeUserTicket();

            if (response.success) {
                router.refresh();
            } else {
                console.error("Error closing ticket:", response.error);
            }
        }
        catch (error) {
            console.error("Error closing ticket:", error);
        }
        finally {
            setPending(false);
        }
    }


    useEffect(() => {
        setTicketReward(getTicketReward(ticketStart, ticketEnd, podAmount));
    }, [ticketStart, ticketEnd, podAmount]);


    return (
        <Tooltip
            text={
                <div>
                    <p className="font-semibold text-center">Reward</p>
                    <p>Working time: <Amount amount={ticketReward.timeReward} /> </p>
                    {/* <p>Pod  bonus: <Amount amount={ticketReward.podReward} /> </p> */}
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
