import { getOpenUserTicket } from "@/lib/actions/gamedata";
import CloseTicketButton from "./CloseTicketButton";
import { formatBetCounter, formatTime } from "@/lib/format-helper";
import TicketCard, { TicketTopRightCorner } from "./TicketCard";
import { TicketIcon } from "@heroicons/react/24/solid";
import Amount, { AmountColor } from "../Amount";
import { TicketBase } from "./TicketBase";

export default async function OpenUserTicket({ ticket }: { ticket: any }) {

  console.log("ticket", ticket);

  // console.log("ticket", ticket);
  return (
    <TicketCard
      topLevel={
        <TicketTopRightCorner children={
          <div className="flex justify-between items-center">
            <p>{formatBetCounter(ticket._count.bets)}</p>
            <Amount
              amount={<div className="blur-xs mr-1 w-3 h-3 rounded-sm bg-zinc-700"></div>}
              color={AmountColor.EmeraldDark}
            />
          </div>

        } />
      }
      childrenLeft={
        <>
          <div className="flex">
            {ticket.open && (<TicketIcon className="size-7 h-7 mr-2" />)}
            <h4 className="text-lg font-bold">{ticket.title}</h4>
          </div>
          <p>{ticket.description}</p>
          <p className="mt-4 italic">
            {formatTime(ticket.timeEstimate)}
          </p>
        </>
      }
      childrenRight={
        <>
        <div className="flex flex-col h-full items-end justify-end">
          <CloseTicketButton ticketStart={ticket.createdAt} />
        </div>
        </>
      }
    />
  );
}
