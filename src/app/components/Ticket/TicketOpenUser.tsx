import CloseTicketButton from "./CloseTicketButton";
import { formatBetCounter, formatTime } from "@/lib/format-helper";
import TicketCard, { TicketTopRightCorner } from "./TicketCard";
import { TicketIcon } from "@heroicons/react/24/solid";
import Amount, { AmountColor } from "../Amount";
import { OpenUserTicket, TicketWithDetails } from "@/lib/actions/gamedata";
import { Tooltip } from "../Tooltip";
import { Clock } from "lucide-react";
import { UserData } from "@/lib/session";
import { TicketLeftSide, TicketNumBetsAmount, TicketRightSide } from "./TicketBase";
import { getTicketReward, TicketReward } from "@/lib/actions/scoring";
import { useEffect, useState } from "react";


export default async function TicketUserOpen({ ticket, user }: { ticket: TicketWithDetails, user: UserData }) {

  const podAmount = ticket.bets.reduce((betSum, bet) => betSum + bet.amount, 0);

  return (
    <div>
      <div className="relative w-full flex z-1">

        <TicketLeftSide ticket={ticket} user={user} />

        {/* Separator */}
        <div className="ticket-separator"></div>

        {/* Right side for betting */}
        <div className="w-1/3 ticket-side">
          <div className="flex flex-col justify-between items-center h-full w-full">
            <TicketNumBetsAmount ticket={ticket} />

            <div className="flex flex-col items-end p-6">
              <CloseTicketButton ticketStart={ticket.createdAt} ticketEnd={ticket.timeEstimate} podAmount={podAmount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // <TicketCard
  //   topLevel={
  //     <TicketTopRightCorner children={
  //       <div className="flex justify-between items-center">
  //         <p>{formatBetCounter(ticket._count.bets)}</p>
  //         <Amount
  //           amount={<div className="blur-xs mr-1 w-3 h-3 rounded-sm bg-zinc-700"></div>}
  //           color={AmountColor.EmeraldDark}
  //         />
  //       </div>

  //     } />
  //   }
  //   childrenLeft={
  //     <>
  //       <div className="flex">
  //         {ticket.open && (<TicketIcon className="size-7 h-7 mr-2" />)}
  //         <h4 className="text-lg font-bold">{ticket.title}</h4>
  //       </div>
  //       <>
  //         <Tooltip
  //           text={

  //             <div className="">
  //               <p>Created:  {formatTime(ticket.createdAt)}</p>
  //               <p>Estimate: {formatTime(ticket.timeEstimate)}</p>
  //             </div>
  //           }>
  //           <div className="inline-flex font-semibold items-center gap-1 mt-4">
  //             <Clock className="size-5 text-zinc-200" />
  //             {<CountdownTimer timeEstimate={ticket.timeEstimate} />}
  //           </div>
  //         </Tooltip>
  //       </>
  //     </>
  //   }
  //   childrenRight={
  //     <>
  //       <div className="flex flex-col h-full items-end justify-end">
  //         <CloseTicketButton ticketStart={ticket.createdAt} ticketEnd={ticket.timeEstimate} />
  //       </div>
  //     </>
  //   }
  // />
}
