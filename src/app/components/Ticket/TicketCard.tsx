import { TicketWithDetails } from "@/lib/actions/gamedata";
import { formatBetCounter, formatDoneInTime, formatTimeEstimate } from "@/lib/format-helper";
import { LockClosedIcon, TicketIcon, UserIcon } from "@heroicons/react/24/outline";
import Amount, { AmountColor } from "../Amount";
import GradientLine from "../GradientLine";
import CreateBet from "../CreateBet";
import React from "react";



export default function TicketCard({ childrenLeft, childrenRight, topLevel }:
    {
        childrenLeft: React.ReactNode,
        childrenRight: React.ReactNode
        topLevel?: React.ReactNode
    }) {

    return (
        <div className="relative p-6 rounded-2xl bg-zinc-700 shadow-lg">
            {topLevel}
            <div className="flex justify-between">
                <div className="w-1/2">
                    {childrenLeft}
                </div>
                <div className={"w-1/2" + (topLevel ? " mt-8" : "")}>
                    {childrenRight}
                </div>
            </div>
        </div>
    );
}

export function TicketTitle({ title, open = true }: { title: string, open?: boolean }) {
    return (
        <div className="flex items-center">
            {open && (<TicketIcon className="w-6 h-6 mr-2" />)}
            {!open && (<LockClosedIcon className="w-6 h-6 mr-2 text-red-500" />)}
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
    )
}
export function TicketTitleDescription({ ticket }: { ticket: TicketWithDetails }) {
    return (
        <div>
            <TicketTitle title={ticket.title} open={ticket.open} />
            <p>{ticket.description}</p>
        </div>
    );
}

// makes a div in the top right corner with lighter background. only bottom left corner is rounded 
export function TicketTopRightCorner({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative font-bold">
            <div className="absolute text-zinc-900 py-2 pl-6 pr-4 -translate-y-6 translate-x-6 w-64 h-11 top-0 right-0 bg-zinc-400 rounded-bl-2xl rounded-tr-2xl shadow-lg">
                {children}
            </div>
        </div>
    );
}

const defaultTicketChildrenLeft = (ticket: TicketWithDetails) => (
    <>
        <div className="flex flex-col justify-between h-full"> 

            <TicketTitleDescription ticket={ticket} />
            <div className="mt-6">
                <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {ticket.author.name}
                </div>
                <p className="italic">
                    {formatTimeEstimate(ticket.timeEstimate)}
                </p>
            </div>
        </div>
    </>
);


export function TicketClosed({ ticket, userId }: { ticket: TicketWithDetails, userId: number }) {

    return (
        <TicketCard
            childrenLeft={defaultTicketChildrenLeft(ticket)}

            childrenRight={
                <>
                    {ticket.bets.some((bet) => bet.userId === userId) && (
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
                    )}

                </>
            }
        />
    );
}

export function TicketOpen({ ticket, userId, userScore }: { ticket: TicketWithDetails, userId: number, userScore: number }) {

    return (
        <>
            <TicketCard

                topLevel={
                    <TicketTopRightCorner children={
                        <div className="flex justify-between items-center">
                            {formatBetCounter(ticket.bets.length)}
                            <Amount
                                amount={ticket.bets.reduce((betSum, bet) => betSum + bet.amount, 0)}
                                color={AmountColor.EmeraldDark}
                                size={5}
                            />
                        </div>
                    } />
                }

                childrenLeft={defaultTicketChildrenLeft(ticket)}

                childrenRight={
                    <>
                        {ticket.bets.some((bet) => bet.userId === userId) ? (
                            <>
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
                                    <GradientLine className={"my-2 w-40"} />
                                    {ticket.bets
                                        .filter((bet) => bet.userId !== userId)
                                        .map((bet) => (
                                            <div key={bet.id} className="flex text-right">
                                                <p>{bet.user.name}</p>
                                                <Amount amount={bet.amount} color={AmountColor.Gray} size={5} />
                                            </div>
                                        ))}
                                </div>
                            </>
                        ) : (
                            <>
                            <div className="flex flex-col justify-end items-end h-full">
                                <CreateBet ticketId={ticket.id} userScore={userScore} />
                            </div>
                            </>
                        )}

                    </>
                }
            />
        </>

    );

}
