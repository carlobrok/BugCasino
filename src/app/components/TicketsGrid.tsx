import { getCurrentUser } from "@/lib/session";
import CreateBet from "./CreateBet";
import { getOtherTickets, getUserScore } from "@/lib/actions/gamedata";
import { BanknotesIcon, FireIcon, UserIcon } from "@heroicons/react/24/outline";
import Amount from "./Amount";


export default async function TicketsGrid() {

  const tickets = await getOtherTickets();
  const userScore = await getUserScore();
  const user = await getCurrentUser();


  if (!user) {
    return <p>Not authenticated</p>;
  }

  if (!tickets || tickets.length === 0) {
    return <p>No tickets found</p>;
  }


  return (
<>
    <div className="flex justify-between items-center">
      // some buttons and drop down menus here for filtering 
    </div>

    <div className="grid grid-cols-1 gap-4">
      {tickets.map((theTicket) => (
        // console.log("ticket", theTicket),
        <div key={theTicket.id} className="p-6 rounded-lg bg-zinc-700 shadow-lg">

          <div className="flex justify-between">


            <div>
              <div>
                <h3 className="text-lg font-bold">{theTicket.title}</h3>
                <p>{theTicket.description}</p>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <UserIcon className="size-4 mr-2"></UserIcon>
                  {theTicket.author.name}
                </div>

                <p className="italic">{theTicket.timeEstimate.toLocaleString('en-UK', { dateStyle: "full", timeStyle: "short" })}</p>
              </div>

            </div>
            <div>

              {
                theTicket.bets.some(bet => bet.userId === user.id) ?
                  <>
                    <div className="flex flex-col items-end justify-between">

                      {
                        theTicket.bets.filter(bet => bet.userId === user.id).map(bet =>
                          <div className="flex items-center">
                            <p>I bet</p>
                            <Amount amount={bet.amount} color={true} />

                            <p>{!!bet.doneInTime ? "for on-time" : "on a delay"}</p>
                          </div>
                        )}
                      <hr className="w-24 my-2 mr-2 border-gray-500" />

                      {
                        theTicket.bets.filter(bet => bet.userId !== user.id).map(bet =>
                          <div className="flex text-right">
                            <p>{bet.user.name}</p>
                            <Amount amount={bet.amount} color={false} />
                          </div>
                        )}
                    </div>
                  </>
                  :
                  <>
                    <div className="flex justify-end items-center">
                      <p className="mr-2">{theTicket.bets.length} Bets</p>
                      {/* <FireIcon className="w-6 h-6 mx-1" /> */}
                      |
                      <Amount amount={theTicket.bets.reduce((betSum, bet) => betSum + bet.amount, 0)}/>

                    </div>
                    <CreateBet ticketId={theTicket.id} userScore={userScore} />
                  </>
              }
            </div>
          </div>

          {/* <CreateBet ticketId={theTicket.id} userScore={userScore} /> */}
        </div>
      ))}
    </div>
    </>
  );
}
