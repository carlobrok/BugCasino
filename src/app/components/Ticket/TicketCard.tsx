import { TicketWithDetails } from "@/lib/actions/gamedata";
import { formatBetCounter, formatDoneInTime, formatTime } from "@/lib/format-helper";
import { LockClosedIcon, TicketIcon, UserIcon } from "@heroicons/react/24/solid";
import Amount, { AmountColor } from "../Amount";
import GradientLine from "../GradientLine";
import CreateBet from "../CreateBet";
import React from "react";


export function NoTicketsCard() {
    return (
        <div className="relative p-6 rounded-2xl bg-zinc-700 shadow-lg w-full">
            <div className="flex justify-between">
                <TicketTitle title="There are no tickets yet .." open={true} />
            </div>
        </div>
    );
}


export default function TicketCard({ childrenLeft, childrenRight, topLevel }:
    {
        childrenLeft: React.ReactNode,
        childrenRight: React.ReactNode
        topLevel?: React.ReactNode
    }) {

    return (
        <div className="relative p-6 rounded-2xl bg-zinc-700 shadow-lg w-full">
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
            {open && (<TicketIcon className="h-6 size-6 mr-2" />)}
            {!open && (<LockClosedIcon className="size-5 mr-2 fill-red-300" />)}
            <h4 className="text-lg font-bold">{title}</h4>
        </div>
    )
}
export function TicketTitleDescription({ ticket }: { ticket: TicketWithDetails }) {
    return (
        <div>
            <TicketTitle title={ticket.title} open={ticket.open} />
            {/* <p>{ticket.description}</p> */}
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
                    Estimated time: {formatTime(ticket.timeEstimate)}
                </p>
            </div>
        </div>
    </>
);


export function TicketClosed({ ticket, userId }: { ticket: TicketWithDetails, userId: number }) {

    return (
        <TicketCard
            childrenLeft={
                <>
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center font-bold">
                                <UserIcon className="size-5 mr-2" />
                                {ticket.author.name}
                            </div>
                            <TicketTitle title={ticket.title} open={ticket.open} />
                        </div>
                        <div className="mt-6">
                            <div className="flex gap-1 italic">
                                <div>
                                    <p>Estimate:</p>
                                    <p>Closed:</p>

                                </div>
                                <div>
                                    <p>{formatTime(ticket.timeEstimate)}</p>
                                    <p>{formatTime(ticket.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

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

    const userHasBetOnTicket = ticket.bets.some((bet) => bet.userId === userId);
    console.log("userHasBetOnTicket", userHasBetOnTicket);

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
                            />
                        </div>
                    } />
                }

                childrenLeft={defaultTicketChildrenLeft(ticket)}

                childrenRight={
                    <>
                        {userHasBetOnTicket ? (
                            <>
                                <div className="flex flex-col items-end justify-between">
                                    {ticket.bets
                                        .filter((bet) => bet.userId === userId)
                                        .map((bet) => (
                                            <div key={bet.id} className="flex items-center">
                                                <p>I bet on {formatDoneInTime(bet.doneInTime)}</p>
                                                <Amount amount={bet.amount} color={AmountColor.Emerald} />
                                            </div>
                                        ))}
                                    <GradientLine className={"my-2 w-40"} />
                                    {ticket.bets
                                        .filter((bet) => bet.userId !== userId)
                                        .map((bet) => (
                                            <div key={bet.id} className="flex text-right">
                                                <p>{bet.user.name}</p>
                                                <Amount amount={bet.amount} color={AmountColor.Gray} />
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
