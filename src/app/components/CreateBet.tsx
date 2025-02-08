"use client";

import { useState, useTransition } from "react";
import { createBet } from "@/lib/actions/bet";
import { BanknotesIcon, CheckIcon } from "@heroicons/react/24/outline"; // Install heroicons: npm install @heroicons/react
import { useRouter } from "next/navigation";
import AmountInputGroup from "./AmountInputGroup";

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

            <div className="flex items-center">
                <AmountInputGroup userScore={userScore} amount={amount} setAmount={setAmount} />
                <button
                    onClick={() => setDoneInTime(!doneInTime)}
                    className={"px-4 py-2 text-white rounded disabled:opacity-50 flex m-2 items-center justify-center backdrop-blur-lg" + (doneInTime ? " bg-green-900" : " bg-red-900")}
                >
                    {/* {doneInTime ? 'finished on time' : 'delayed completion'} */}
                    {doneInTime ? "for on-time" : "on a delay"}
                </button>
            </div>
            <button
                onClick={handleClick}
                disabled={isPending}
                className=" px-3 py-1 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center"
            >
                <p className="mr-2">Create Bet</p>
                <CheckIcon className="w-4 h-4" />
                {/* <BanknotesIcon className="w-6 h-6" /> */}
            </button>
        </>
    );
}
