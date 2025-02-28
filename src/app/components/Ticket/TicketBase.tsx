import { TicketWithDetails } from "@/lib/actions/gamedata";
import UserIconName from "../UserIconName";
import { formatBetCounter, formatDoneInTime, formatTime } from "@/lib/format-helper";
import { ChevronDownIcon, LockClosedIcon, TicketIcon } from "@heroicons/react/24/solid";
import Amount, { AmountColor } from "../Amount";
import GradientLine from "../GradientLine";
import CreateBet from "../CreateBet";
import { UserData } from "@/lib/session";
import ExpandableList from "./ExpandableList";


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


export function TicketBase({ ticket, user }: { ticket: TicketWithDetails, user: UserData }) {

    const userHasBetOnTicket = ticket.bets.some((bet) => bet.userId === user.id);




    return (

        <div className="relative w-full flex">

            {/* Ticket Info on the left side */}
            <div className="relative ticket-side p-6 w-2/3 flex flex-col justify-between">
                {/* Titel, Author and estimated Time */}
                <div>
                    <TicketTitle ticket={ticket} />
                    <UserIconName name={ticket.author.name} avatar={ticket.author.avatar} />
                </div>
                <div className="mt-6 flex gap-2 italic">
                    <div className=" bottom-5 left-5 bg-zinc-500 shadow-md text-white rounded-full my-auto px-3 py-1 text-sm">
                        #{ticket.id}
                    </div>
                    <div className="text-sm">
                        {ticket.open ?
                            (
                                <>
                                    <p>Created:  {formatTime(ticket.createdAt)}</p>
                                    <p>Estimate: {formatTime(ticket.timeEstimate)}</p>
                                </>
                            ) : (
                                <>
                                    <p>Estimate: {formatTime(ticket.timeEstimate)}</p>
                                    <p>Finished: {formatTime(ticket.finishedAt || new Date())}</p>
                                </>
                            )
                        }
                    </div>
                </div>


            </div>
            <div className="ticket-separator"></div>
            {/* Right side for betting */}
            <div className="w-1/3 ticket-side">

                {userHasBetOnTicket ? (
                    <>
                        <div className="flex flex-col justify-between items-center h-full w-full">
                            <div className="flex w-full items-center justify-between rounded-2xl px-5 py-2 bg-zinc-500 text-white font-bold">

                                {formatBetCounter(ticket.bets.length)}
                                <Amount
                                    amount={ticket.bets.reduce((betSum, bet) => betSum + bet.amount, 0)}
                                    color={AmountColor.EmeraldDark}
                                />


                            </div>



                            {ticket.bets.some((bet) => bet.userId === user.id) && (
                                <div className="flex flex-col items-center justify-end text-center p-6">

                                    {/* User bet on the ticket */}

                                    {ticket.bets
                                        .filter((bet) => bet.userId === user.id)
                                        .map((bet) => (
                                            <span key={bet.id} className="inline-block ">
                                                I bet <Amount amount={bet.amount} color={AmountColor.Emerald} margin={true} />
                                                on {formatDoneInTime(bet.doneInTime)}
                                            </span>
                                        ))}

                                    {/* " All bets v " button */}

                                    <div className="mt-4 ">
                                        <button className="inline link-btn link-btn-opague hover:text-white text-gray-200">
                                            All bets
                                            <ChevronDownIcon className="ml-1 size-5" />
                                        </button>
                                    </div>



                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col justify-between items-center h-full w-full">
                            <div className="flex w-full items-center justify-between rounded-2xl px-5 py-2 bg-zinc-500 text-white font-bold">
                                {formatBetCounter(ticket.bets.length)}
                                <Amount
                                    amount={ticket.bets.reduce((betSum, bet) => betSum + bet.amount, 0)}
                                    color={AmountColor.EmeraldDark}
                                />
                            </div>
                            <div className="p-6 ">
                                <CreateBet ticketId={ticket.id} userScore={user.score} />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* <ExpandableList /> */}
        </div>
    );
}


