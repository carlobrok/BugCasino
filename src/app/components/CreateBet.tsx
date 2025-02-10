"use client";

import { useState, useTransition } from "react";
import { createBet } from "@/lib/actions/bet";
import { BanknotesIcon, CheckIcon } from "@heroicons/react/24/outline"; // Install heroicons: npm install @heroicons/react
import { useRouter } from "next/navigation";
import AmountInputGroup from "./AmountInputGroup";
import { formatDoneInTime } from "@/lib/format-helper";

export default function CreateBet({ ticketId, userScore }: { ticketId: number, userScore: number }) {
    const [isPending, startTransition] = useTransition();
    const [amount, setAmount] = useState(0);
    const [doneInTime, setDoneInTime] = useState(true);

    const router = useRouter();

    async function handleClick() {
        // Start a transition so that the UI knows we're in a pending state.
        startTransition(async () => {
            try {
                await createBet(ticketId, amount, doneInTime);
                router.refresh();
            } catch (error) {
                console.error("Error creating ticket", error);
            }
        });
    }

    return (
        <>

            <div className="flex items-center space-x-2">
                <AmountInputGroup userScore={userScore} amount={amount} setAmount={setAmount} />
                <button
                    onClick={() => setDoneInTime(!doneInTime)}
                    className={"px-3 py-1 text-white rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center backdrop-blur-lg" + (doneInTime ? " bg-green-900" : " bg-red-900")}
                >
                    {formatDoneInTime(doneInTime)}
                </button>
                <button
                    onClick={handleClick}
                    disabled={isPending || amount <= 0}
                    className={" px-3 py-1 text-white rounded-lg shadow-md enabled:hover:bg-zinc-400 disabled:opacity-50 flex items-center justify-center" + (isPending ? " bg-zinc-600 animate-pulse" : " bg-zinc-500")}
                >
                    <p className="mr-2">bet</p>
                    <CheckIcon className="w-4 h-4" />
                </button>
            </div>
        </>
    );
}
