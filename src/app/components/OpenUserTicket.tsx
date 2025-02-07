import { getOpenUserTicket } from "@/lib/gamedata";

export default async function OpenUserTicket() {

  const ticket = await getOpenUserTicket();

  if (!ticket) {
    return null;
  }

  console.log("ticket", ticket);
  return (
    <>
    <h2 className="text-xl font-bold">Your Ticket</h2>
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold">{ticket.title}</h3>
      <p>{ticket.description}</p>
      <p>{ticket.author.name}</p>
      {/* <p>{ticket.timeEstimate.toLocaleString('de-DE', {weekday: "short", day: "2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit", })}</p> */}
      <p>{ticket.timeEstimate.toLocaleString('en-UK', {dateStyle:"full", timeStyle:"short"})}</p>
      <p>{ticket._count.bets} Bets</p>
    </div>
    </>
  );
}
