import { getUser } from "@/lib/session";
import AppPage from "../../components/AppPage";
import { ScoreChart } from "../../components/ScoreChart";
import { getUserTransactions } from "@/lib/transaction";
import UserIconName from "../../components/UserIconName";
import { getGroupName, getTicketsForUser, getUserProfile, getUserScore } from "@/lib/actions/gamedata";
import { TicketIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Amount, { AmountColor } from "../../components/Amount";
import { TicketBase } from "../../components/Ticket/TicketBase";
import React from "react";
import { NoTicketsCard } from "../../components/Ticket/TicketCard";
import { ro } from "date-fns/locale";
import TicketUserOpen from "@/app/components/Ticket/TicketOpenUser";
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id, 10); // Convert params.id to a number
  
  if (isNaN(userId)) {
    console.error("Invalid user ID");
    return <AppPage>Invalid user ID</AppPage>;
  }

  const currentUser = await getUser();
  if (currentUser && currentUser.id === userId) {
    redirect("/profile");
  }
  
  const userProfileData = await getUserProfile(userId);

  if (!userProfileData) {
    console.error("User does not exist");
    return <AppPage>User does not exist</AppPage>;
  }

  const userTransactions = await getUserTransactions({ userId });
  const userTickets = await getTicketsForUser(userId);

  const openTicket = userTickets.find((ticket) => ticket.open);
  const closedTickets = userTickets.filter((ticket) => !ticket.open).length;

  // this is the currently logged in user
  const minimalUserData = {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    score: currentUser.score,
    transactions: userTransactions,
  };

  return (
    <AppPage>
      <div className="container max-w-2xl mx-auto p-4">
        <h1 className="text-center mb-8">Profile</h1>
        <div className="flex justify-center gap-10 mb-20">
          <UserIconName name={userProfileData.name} avatar={userProfileData.avatar} size={30} textClassNames="text-xl font-semibold" />
          <div className="flex items-center gap-2">
            <UserGroupIcon className="size-6 mx-1" />
            <h4>{userProfileData.group?.name}</h4>
          </div>
        </div>

        <div className="flex justify-between my-5">
          <h3>Score</h3>
          <Amount amount={userProfileData.score} color={AmountColor.Emerald} size={25} />
        </div>

        <ScoreChart score={userProfileData.score} firstDate={userProfileData.createdAt} data={userTransactions} />

        <div className="flex justify-between items-center">
          <h3>Tickets</h3>
          <div className="flex items-center gap-2 text-xl">
            {closedTickets}
            <TicketIcon className="size-6"></TicketIcon>
            <p>finished</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-col gap-4">
            {userTickets.length > 0 ? userTickets.map((theTicket) => (
              <TicketBase key={theTicket.id} ticket={theTicket} user={minimalUserData} />
            )) : (
              <div className="opacity-30">
                <NoTicketsCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppPage>
  );
}