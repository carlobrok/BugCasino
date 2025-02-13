"use client";

import { useState, useTransition } from "react";
import { createBet } from "@/lib/actions/bet";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import AmountInputGroup from "./AmountInputGroup";
import { formatDoneInTime } from "@/lib/format-helper";
import LoadingIndicator from "./LoadingIndicator";

export default function CreateBet({ ticketId, userScore }: { ticketId: number, userScore: number }) {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [doneInTime, setDoneInTime] = useState(true);
    const [success, setSuccess] = useState(false);	
    const [feedback, setFeedback] = useState("");

    const [betPlaced, setBetPlaced] = useState(false);


    const router = useRouter();


    const submitBet = async () => {
        setIsLoading(true);

        try {
            const response = await createBet(ticketId, amount, doneInTime);

            if (response.success) {
                setBetPlaced(true);
            } else {
                alert(response.error);
            }
        } 
        catch (error) {
            setFeedback("Some error occoured");
        }
        finally {
            setIsLoading(false);
        }
    };

    if (betPlaced) {
        return (
            <div className="flex items-center space-x-2 transition-opacity duration-500 ease-out opacity-100">
                <p className="text-green-500">Bet placed</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center space-x-2">
                <AmountInputGroup userScore={userScore} amount={amount} setAmount={setAmount} disableInput={isLoading} />
                <button
                    onClick={() => setDoneInTime(!doneInTime)}
                    disabled={isLoading}
                    className={"px-3 py-1 text-white rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center backdrop-blur-lg" + (doneInTime ? " bg-green-900" : " bg-red-900")}
                >
                    {formatDoneInTime(doneInTime)}
                </button>
                <button
                    onClick={submitBet}
                    disabled={isLoading || amount <= 0}
                    className={" px-3 py-1 text-white rounded-lg shadow-md enabled:hover:bg-zinc-400 disabled:opacity-50 flex items-center justify-center" + (isLoading ? " bg-zinc-600" : " bg-zinc-500")}
                >
                    <p className="mr-2">bet</p>
                    {isLoading ?
                        <LoadingIndicator />
                        :
                        <CheckIcon className="w-4 h-4" />
                    }
                </button>
            </div>
        </>
    );
}
