import { getOpenUserTicket } from "@/lib/actions/gamedata";
import CloseTicketButton from "./CloseTicketButton";

export default async function OpenUserTicket() {

  const ticket = await getOpenUserTicket();

  if (!ticket) {
    return null;
  }



  // console.log("ticket", ticket);
  return (
    <>
      <div className="p-6 rounded-lg bg-zinc-700 shadow-lg">
        <div className="flex justify-between">
          <div className="flex flex-col" >
            <h3 className="text-lg font-bold">{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p className="mt-3 italic">{ticket.timeEstimate.toLocaleString('en-UK', { dateStyle: "full", timeStyle: "short" })}</p>
          </div>
          {/* <p>{ticket.author.name}</p> */}
          <div className="flex flex-col items-end justify-between">
            <p>{ticket._count.bets} Bets</p>
            <CloseTicketButton />
          </div>
        </div>

      </div>
    </>
  );
}
