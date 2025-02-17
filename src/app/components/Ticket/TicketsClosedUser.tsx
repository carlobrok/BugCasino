"use client";
import { useEffect, useState } from "react";
import LoadingIndicator from "../LoadingIndicator";
import { Ticket, TicketWithDetails } from "@/lib/actions/gamedata"
import React from "react";
import TicketCard, { TicketClosed, TicketTitle, TicketTopRightCorner } from "./TicketCard";
import { formatBetCounter, formatDoneInTime, formatTimeEstimate, formatTimeEstimateShort } from "@/lib/format-helper";
import Amount, { AmountColor } from "../Amount";
import GradientLine from "../GradientLine";

function ClosedUserTicketCard({ ticket }: { ticket: TicketWithDetails }) {

    return (
        <TicketCard
            topLevel={
                <TicketTopRightCorner children={
                    <div className="flex justify-between items-center">
                        <p>{formatBetCounter(ticket._count.bets)}</p>
                        <Amount
                            amount={ticket.bets.reduce((betSum, bet) => betSum + bet.amount, 0)}
                            color={AmountColor.EmeraldDark}
                        />
                    </div>

                } />
            }

            childrenLeft={
                <>
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            {/* <div className="flex items-center font-bold">
                                <UserIcon className="size-5 mr-2" />
                                {ticket.author.name}
                            </div> */}
                            <TicketTitle title={ticket.title} open={ticket.open} />
                        </div>
                        <div className="mt-6">
                            <div className="flex gap-1 italic">
                                <div>
                                    <p>Estimate:</p>
                                    <p>Closed:</p>

                                </div>
                                <div>
                                    <p>{formatTimeEstimate(ticket.timeEstimate)}</p>
                                    <p>{formatTimeEstimate(ticket.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

            childrenRight={
                <>
                    <div className="flex flex-col items-end">
                        <GradientLine className={"my-2"} />
                        <div className="flex items-center">
                            <p>I bet</p>
                            <Amount amount={1} color={AmountColor.Emerald} />
                            <p>on {formatDoneInTime(true)}</p>
                        </div>

                    </div>
                    {/* {ticket.bets.some((bet) => bet.userId === userId) && (
                        <div className="flex flex-col items-end justify-between">
                            {ticket.bets
                                .filter((bet) => bet.userId === userId)
                                .map((bet) => (
                                    <div key={bet.id} className="flex items-center">
                                        <p>I bet</p>
                                        <Amount amount={bet.amount} color={AmountColor.Emerald} />
                                        <p>on {formatDoneInTime(bet.doneInTime)}</p>
                                    </div>
                                ))}
                            <GradientLine className={"my-2"} />
                            {ticket.bets
                                .filter((bet) => bet.userId !== userId)
                                .map((bet) => (
                                    <div key={bet.id} className="flex text-right">
                                        <p>{bet.user.name}</p>
                                        <Amount amount={bet.amount} color={AmountColor.Gray} />
                                    </div>
                                ))}
                        </div>
                    )} */}

                </>
            }
        />
    );
}


export default function TicketClosedUser({ tickets }: { tickets: TicketWithDetails[] }) {

    const [showTickets, setShowTickets] = useState(false);

    const handleClick = () => {
        setShowTickets(!showTickets);
    };

    return (
        <>
            <div className="flex justify-center mt-15">
                <button
                    onClick={handleClick}
                    className="bg-zinc-700/30 hover:bg-zinc-300/30 hover:cursor-pointer text-white px-4 py-2 rounded-2xl"
                >
                    {showTickets ? "hide" : "show"} my closed tickets
                </button>
            </div>
            <div className="mt-8 flex flex-col items-center gap-4 w-full">

                {showTickets && (

                    tickets.map((ticket) => (
                        <React.Fragment key={ticket.id}>
                            <ClosedUserTicketCard ticket={ticket} />
                        </React.Fragment>
                    ))

                )}
            </div>
        </>
    );
}