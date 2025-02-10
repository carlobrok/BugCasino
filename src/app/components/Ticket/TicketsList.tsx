// In your TicketsGrid.tsx (server component)
import { getCurrentUser } from "@/lib/session";
import { getGroups, getOtherTickets, getUserScore } from "@/lib/actions/gamedata";
import TicketStatusFilter from "./TicketStatusFilter";
import { TicketClosed, TicketOpen } from "./TicketCard";
import GroupFilterDropdown from "./GroupFilterDropdown";

interface TicketsGridProps {
  searchParams: {
    open?: string;
    groupName?: string;
  };
}

export default async function TicketsList({ searchParams }: TicketsGridProps) {
  const { open, groupName } = await searchParams;

  // Parse the filtering values from searchParams.
  const filterOpen =
    open === "true"
      ? true
      : open === "false"
        ? false
        : undefined;

  const filterGroupName = groupName || undefined;

  // Pass the filters to your data-access function:
  const tickets = await getOtherTickets({ open: filterOpen, groupName: filterGroupName });
  const {name, userScore} = await getUserScore();
  const user = await getCurrentUser();

  if (!user) {
    return <p>Not authenticated</p>;
  }

  const groups = await getGroups();

  if (!tickets || tickets.length === 0) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <TicketStatusFilter />
          <GroupFilterDropdown groups={groups.map(group => group.name)} />
        </div>

        <p>No tickets found</p>
      </>
    );
  }


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <TicketStatusFilter />
        <GroupFilterDropdown groups={groups.map(group => group.name)} />
      </div>


      <div className="flex flex-col gap-4">
        {tickets.map((theTicket) => (
            <>
              {theTicket.open && ( <TicketOpen key={theTicket.id} ticket={theTicket} userId={user.id} userScore={userScore} />)}
              {!theTicket.open && ( <TicketClosed key={theTicket.id} ticket={theTicket} userId={user.id} />)}
            </>

            // <TicketCard
            //   childrenLeft={
                // <>
                //   <div>
                //     <div className="flex items-center">
                //       {theTicket.open && (<TicketIcon className="w-6 h-6 mr-2" />)}
                //       {!theTicket.open && (<LockClosedIcon className="w-6 h-6 mr-2 text-red-500" />)}
                //       <h3 className="text-lg font-bold">{theTicket.title}</h3>
                //     </div>
                //     <p>{theTicket.description}</p>
                //   </div>
                //   <div className="mt-6">
                //     <div className="flex items-center">
                //       <UserIcon className="w-4 h-4 mr-1" />
                //       {theTicket.author.name}
                //     </div>
                //     <p className="italic">

                //       {formatTimeEstimate(theTicket.timeEstimate)}
                //     </p>
                //   </div>
            //     </>
            //   }
            //   childrenRight={
            //     <>
            //       <div>
            //         {/* The user has already bet on this ticket */}
            //         {theTicket.bets.some((bet) => bet.userId === user.id) ? (
            //           <div className="flex flex-col items-end justify-between">
            //             {theTicket.bets
            //               .filter((bet) => bet.userId === user.id)
            //               .map((bet) => (
            //                 <div key={bet.id} className="flex items-center">
            //                   <p>I bet</p>
            //                   <Amount amount={bet.amount} color={true} />
            //                   <p>on {formatDoneInTime(bet.doneInTime)}</p>
            //                 </div>
            //               ))}

            //             <GradientLine className={"my-2"} />

            //             {theTicket.bets
            //               .filter((bet) => bet.userId !== user.id)
            //               .map((bet) => (
            //                 <div key={bet.id} className="flex text-right">
            //                   <p>{bet.user.name}</p>
            //                   <Amount amount={bet.amount} color={false} />
            //                 </div>
            //               ))}
            //           </div>
            //         ) : (
            //           <div className="flex flex-col justify-between h-full">
            //             <div className="flex justify-end items-center">
            //               <p className="mr-2">
            //                 {formatBetCounter(theTicket.bets.length)}
            //               </p>
            //               |{" "}
            //               <Amount
            //                 amount={theTicket.bets.reduce(
            //                   (betSum, bet) => betSum + bet.amount,
            //                   0
            //                 )}
            //               />
            //             </div>
            //             {theTicket.open && (<CreateBet ticketId={theTicket.id} userScore={userScore} />)}
            //           </div>
            //         )}
            //       </div>
            //     </>
            //   }
            // />
          ))
        }
      </div >
    </>
  );
}
