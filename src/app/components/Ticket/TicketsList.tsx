// In your TicketsGrid.tsx (server component)
import { getCurrentUser } from "@/lib/session";
import { getGroups, getOtherTickets, getUserScore } from "@/lib/actions/gamedata";
import TicketStatusFilter from "./TicketStatusFilter";
import { TicketClosed, TicketOpen } from "./TicketCard";
import GroupFilterDropdown from "./DropdownGroupFilter";
import React from "react";
import TicketStatusDropdown from "./DropdownTicketStatus";

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
  const { name, userScore } = await getUserScore();
  const user = await getCurrentUser();

  if (!user) {
    return <p>Not authenticated</p>;
  }

  const groups = await getGroups();

  const filterSection = (
    <div className="space-x-4 mb-4">
      <TicketStatusDropdown />
      <GroupFilterDropdown groups={groups.map(group => group.name)} />
    </div>
  );

  if (!tickets || tickets.length === 0) {
    console.log("No tickets found");
    return (
      <>
        {filterSection}
        <p>No tickets found</p>
      </>
    );
  }


  return (
    <>
      {filterSection}
      
      <div className="flex flex-col gap-4">
        {tickets.map((theTicket) => (
          <React.Fragment key={theTicket.id}>
            {theTicket.open && (<TicketOpen ticket={theTicket} userId={user.id} userScore={userScore} />)}
            {!theTicket.open && (<TicketClosed ticket={theTicket} userId={user.id} />)}
          </React.Fragment>
        ))
        }
      </div >
    </>
  );
}
