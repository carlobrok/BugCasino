'use client';

import { TicketWithDetails } from "@/lib/actions/gamedata";
import UserIconName from "../UserIconName";
import { formatBetCounter, formatDoneInTime, formatTime } from "@/lib/format-helper";
import { ChevronDownIcon, ChevronUpIcon, LockClosedIcon, TicketIcon } from "@heroicons/react/24/solid";
import Amount, { AmountColor } from "../Amount";
import CreateBet from "../CreateBet";
import { UserData } from "@/lib/session";
import BetsList, { PunctualityLabel } from "./BetsList";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "../Tooltip";
import { Clock } from "lucide-react";
import { TicketIdBatch } from "./TicketCard";
import Link from "next/link";
import { TicketUserBet } from "./TicketUserBet";

export function TicketTitle({ ticket }: { ticket: TicketWithDetails }) {
    return (
        <div className="inline-flex items-center">
            {ticket.open ?
                <TicketIcon className="size-6 mr-2 shrink-0 " />
                :
                <LockClosedIcon className="size-5 mr-2 shrink-0 fill-red-300" />
            }
            <h4 className="text-lg font-bold">{ticket.title}</h4>
        </div>
    );
}

// return the remaining time until the ticket is estimated to be finished as a string
// it must be a counter that counts down
// show e.g. "1h 30m" or "30m 20s" 
// if the time is already over, show "overdue"

export function remainingTime(time: Date) {
    const now = new Date();
    const diff = time.getTime() - now.getTime();
    if (diff < 0) {
        return <PunctualityLabel doneInTime={false} />;
    }
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
}

export function CountdownTimer({ timeEstimate }: { timeEstimate: Date }) {
    const [time, setTime] = useState(remainingTime(timeEstimate));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(remainingTime(timeEstimate));
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [timeEstimate]);

    return (
        <span>
            {time}
        </span>
    );
}


export function TicketLeftSide({ ticket, user }: { ticket: TicketWithDetails, user: UserData }) {


    return (
        <>
            {/* Ticket Info on the left side */}

            {/* <div className="relative ticket-side p-6 w-1/2 md:w-2/3 flex flex-col justify-between"></div> */}

            <div className="relative ticket-side p-6 w-2/3 flex flex-col justify-between">
                {/* Titel, Author and estimated Time */}
                <div>
                    <TicketTitle ticket={ticket} />
                    <Link
                        className="flex items-center link-translate"
                        href={`/profile/${ticket.authorId}`}
                    >
                        <UserIconName name={ticket.author.name} avatar={ticket.author.avatar} />
                    </Link>
                </div>
                <div className="mt-6 flex items-center gap-2">
                    <TicketIdBatch ticketId={ticket.id} />

                    {ticket.open ?
                        (
                            <>
                                <Tooltip
                                    text={
                                        <div className="flex flex-col">
                                            <p className="flex flex-row justify-between space-x-1"><span>Created: </span><span>{formatTime(ticket.createdAt)}</span></p>
                                            <p className="flex flex-row justify-between space-x-1"><span>Estimate: </span><span>{formatTime(ticket.timeEstimate)}</span></p>
                                        </div>
                                    }>
                                    <div className="inline-flex font-semibold items-center gap-1">
                                        <Clock className="size-5 text-zinc-200" />
                                        {<CountdownTimer timeEstimate={ticket.timeEstimate} />}
                                    </div>
                                </Tooltip>
                            </>
                        )
                        :
                        (
                            <>
                                <Tooltip
                                    text={
                                        <div className="flex flex-col">
                                            <p className="flex flex-row justify-between space-x-1"><span>Created: </span> <span>{formatTime(ticket.createdAt)}</span></p>
                                            <p className="flex flex-row justify-between space-x-1"><span>Estimate: </span><span>{formatTime(ticket.timeEstimate)}</span></p>
                                            <p className="flex flex-row justify-between space-x-1"><span>Finished: </span><span>{formatTime(ticket.finishedAt || new Date())}</span></p>
                                        </div>
                                    }>
                                    <div className="inline-flex font-semibold items-center gap-1">
                                        {ticket.finishedInTime !== null && <PunctualityLabel doneInTime={ticket.finishedInTime} />}
                                    </div>
                                </Tooltip>
                            </>
                        )}
                </div>


            </div>
        </>
    );
}



function TicketSeeAllBets({ handleToggle, isOpen, numBets }: {
    handleToggle: () => void, isOpen: boolean, numBets: number
}) {
    return (
        <div className="mt-4 ">
            <button
                disabled={numBets === 0}
                className={"inline link-btn link-btn-opague text-gray-200 enabled:hover:text-white"}
                onClick={handleToggle}
            >
                {numBets === 0 ? "No bets" : (
                    <>
                        {isOpen ? "Hide bets" : "See all bets"}
                        {isOpen ? (
                            <ChevronUpIcon className="ml-1 size-5" />
                        ) : (
                            <ChevronDownIcon className="ml-1 size-5" />
                        )}
                    </>
                )}


            </button>
        </div>
    );
}

export function TicketNumBetsAmount({ ticket }: { ticket: TicketWithDetails }) {
    return (<div className="flex w-full items-center justify-between rounded-2xl px-5 py-2 bg-zinc-500 text-white font-bold">
        {formatBetCounter(ticket.bets.length)}
        <Amount
            amount={ticket.bets.reduce((betSum, bet) => betSum + bet.amount, 0)}
            color={AmountColor.EmeraldDark}
        />
    </div>);
}

export function TicketRightSide({ ticket, user, userHasBetOnTicket, handleToggle, isOpen }: { ticket: TicketWithDetails, user: UserData, userHasBetOnTicket: boolean, handleToggle: () => void, isOpen: boolean }) {

    return (
        <>
            <div className="w-1/3 ticket-side">
                <div className="flex flex-col justify-between items-center h-full w-full">
                    <TicketNumBetsAmount ticket={ticket} />

                    {!ticket.open || new Date(ticket.timeEstimate) < new Date() ? (
                        <>
                            <div className="flex flex-col items-center justify-center p-6">
                                <>
                                    <TicketUserBet ticket={ticket} user={user} userHasBetOnTicket />
                                    <TicketSeeAllBets handleToggle={handleToggle} isOpen={isOpen} numBets={ticket.bets.length} />
                                </>
                            </div>

                        </>
                    ) : (
                        <>

                            {/* If the user has bet on the ticket, show the bets */}

                            {userHasBetOnTicket ? (
                                <>
                                    <div className="flex flex-col items-center justify-end text-center p-6">

                                        {/* User bet on the ticket */}

                                        <TicketUserBet ticket={ticket} user={user} userHasBetOnTicket />
                                        {/* " All bets v " button */}

                                        <TicketSeeAllBets handleToggle={handleToggle} isOpen={isOpen} numBets={ticket.bets.length} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-6 ">
                                        <CreateBet ticketId={ticket.id} userScore={user.score} bets={ticket.bets} />
                                    </div>
                                </>
                            )}
                        </>)}
                </div>
            </div>
        </>

    );
}

export function TicketBase({ ticket, user }: { ticket: TicketWithDetails, user: UserData }) {
    const [isOpen, setIsOpen] = useState(false);

    const userHasBetOnTicket = ticket.bets.some((bet) => bet.userId === user.id);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };


    return (
        <div>
            <div className="relative w-full flex z-1">

                <TicketLeftSide ticket={ticket} user={user} />

                {/* Separator */}
                <div className="ticket-separator"></div>

                {/* Right side for betting */}
                <TicketRightSide ticket={ticket} user={user} userHasBetOnTicket={userHasBetOnTicket} handleToggle={handleToggle} isOpen={isOpen} />

            </div>
            {/* Expandable list appears below */}
            <BetsList bets={ticket.bets} isOpen={isOpen} />
        </div>
    );
}


