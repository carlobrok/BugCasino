import { getOpenUserTicket } from "@/lib/actions/gamedata";
import CloseTicketButton from "../CloseTicketButton";
import { formatBetCounter, formatTimeEstimate } from "@/lib/format-helper";
import TicketCard, { TicketTopRightCorner } from "./TicketCard";
import { TicketIcon } from "@heroicons/react/24/outline";
import Amount, { AmountColor } from "../Amount";

export default async function OpenUserTicket() {

  const ticket = await getOpenUserTicket();

  if (!ticket) {
    return null;
  }



  // console.log("ticket", ticket);
  return (
    <TicketCard
      topLevel={
        <TicketTopRightCorner children={
          <div className="flex justify-between items-center">
            <p>{formatBetCounter(ticket._count.bets)}</p>
            <Amount
              amount={<div className="blur-sm mr-1 w-4 h-2 rounded bg-zinc-700"></div>}
              color={AmountColor.EmeraldDark}
            />
          </div>

        } />
      }
      childrenLeft={
        <>
          <div className="flex items-center">
            {ticket.open && (<TicketIcon className="w-6 h-6 mr-2" />)}
            <h3 className="text-lg font-bold">{ticket.title}</h3>
          </div>
          <p>{ticket.description}</p>
          <p className="mt-4 italic">
            {formatTimeEstimate(ticket.timeEstimate)}
          </p>
        </>
      }
      childrenRight={
        <>
        <div className="flex flex-col h-full items-end justify-end">
          <CloseTicketButton />
        </div>
        </>
      }
    />
  );
}
