"use client";

import { useEffect, useState, useTransition } from "react";
import { createBet } from "@/lib/actions/bet";
import AmountInputGroup from "./AmountInputGroup";
import { formatDoneInTime } from "@/lib/format-helper";
import LoadingIndicator from "./LoadingIndicator";
import { getBetReward, getWinReturnFactor } from "@/lib/actions/scoring";
import { Tooltip } from "./Tooltip";
import Amount from "./Amount";


export default function CreateBet({ ticketId, userScore, bets }: {
    ticketId: number, userScore: number, bets: {
        user: {
            name: string;
            avatar: string;
        };
        id: number;
        userId: number;
        amount: number;
        doneInTime: boolean;
    }[]
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [success, setSuccess] = useState(false);
    const [feedback, setFeedback] = useState("");

    const [betPlaced, setBetPlaced] = useState(false);

    const [intimeReturnFactor, setIntimeReturnFactor] = useState(0);
    const [delayedReturnFactor, setDelayedReturnFactor] = useState(0);

    const [intimeWin, setIntimeWin] = useState(0);
    const [delayedWin, setDelayedWin] = useState(0);

    useEffect(() => {

        const intimePod = bets.filter(bet => bet.doneInTime).reduce((sum, bet) => sum + bet.amount, 0) + 0;
        const delayedPod = bets.filter(bet => !bet.doneInTime).reduce((sum, bet) => sum + bet.amount, 0) + 0;

        // console.log("Intime pod", intimePod, "Delayed pod", delayedPod);

        setIntimeReturnFactor(getWinReturnFactor(amount, intimePod, intimePod + delayedPod));
        setDelayedReturnFactor(getWinReturnFactor(amount, delayedPod, intimePod + delayedPod));

        setIntimeWin(getBetReward(amount, amount + intimePod, amount + intimePod + delayedPod));
        setDelayedWin(getBetReward(amount, amount + delayedPod, amount + intimePod + delayedPod));

    }, [bets, amount]);

    const submitBet = async (doneInTime: boolean) => {
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
                <p className="text-green-700">Bet placed</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center space-y-2">
                    <p className="font-semibold">Create a bet</p>

                <AmountInputGroup userScore={userScore} amount={amount} setAmount={setAmount} disableInput={isLoading} />
                <div className="flex items-center space-x-2">

                    {/* input for in time bet */}

                    <Tooltip text={
                        <div className="flex flex-col items-center space-y-2">
                            <p className="font-bold">Win prediction</p>
                            <p><Amount amount={intimeWin} />  (x{intimeReturnFactor.toFixed(2)})</p>
                        </div>
                    }
                        enabled={amount > 0}
                    >

                        <button
                            onClick={() => submitBet(true)}
                            disabled={isLoading || amount <= 0}
                            className={"flex-col items-center link-btn backdrop-blur-lg link-green"}
                        >
                            {formatDoneInTime(true)}

                            {isLoading ?
                                <LoadingIndicator />
                                :
                                (amount > 0 && <span className="font-bold">x{intimeReturnFactor.toFixed(2)}</span>)
                            }

                        </button>
                    </Tooltip>


                    {/* Input for delayed bet */}

                    <Tooltip text={
                        <div className="flex flex-col items-center space-y-2">
                            <p className="font-bold">Win prediction </p>
                            <p><Amount amount={delayedWin} /> (x{delayedReturnFactor.toFixed(2)})</p>

                        </div>
                    }
                        enabled={amount > 0}
                    >
                        <button
                            onClick={() => submitBet(false)}
                            disabled={isLoading || amount <= 0}
                            className={"flex-col items-center link-btn backdrop-blur-lg link-red "}
                        >
                            {formatDoneInTime(false)}
                            {isLoading ?
                                <LoadingIndicator />
                                :
                                (amount > 0 && <span className="font-bold">x{delayedReturnFactor.toFixed(2)}</span>)
                            }
                        </button>
                    </Tooltip>
                </div>
            </div>
        </>
    );
}
