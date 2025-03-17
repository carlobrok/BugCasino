import { getCurrentUser, getUser, UserData } from '@/lib/session';
import AppPage from '../components/AppPage';
import { ScoreChart } from '../components/ScoreChart';
import { getUserTransactions, TransactionType } from '@/lib/transaction';
import UserIconName from '../components/UserIconName';
import GradientLine from '../components/GradientLine';
import { getTicketsForUser, getUserProfile, getUserScore } from '@/lib/actions/gamedata';
import { TicketIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import Amount, { AmountColor } from '../components/Amount';
import { TicketBase } from '../components/Ticket/TicketBase';
import React from 'react';
import { NoTicketsCard } from '../components/Ticket/TicketCard';
import CreateTicket from '../components/CreateTicket';
import TicketUserOpen from '../components/Ticket/TicketOpenUser';


export default async function ProfilePage() {

   const user = await getCurrentUser();

   if (!user) {
      return <AppPage>Unauthorized</AppPage>;
   }

   const userProfileData = await getUserProfile(user.id);
   if (!userProfileData) {
      return <AppPage>User does not exist</AppPage>;
   }

   // const groupName: string = await getGroupName(user.groupId);
   const userTransactions = await getUserTransactions({ userId: user.id });
   const userTickets = await getTicketsForUser(user.id);

   const openTicket = userTickets.find(ticket => ticket.open);

   const closedTickets = userTickets.filter(ticket => !ticket.open).length;

   const minimalUserData: UserData = {
      id: userProfileData.id,
      name: userProfileData.name,
      avatar: userProfileData.avatar,
      score: userProfileData.score,
      transactions: userTransactions,
   }


   return (
      <AppPage>
         <div className="container max-w-2xl mx-auto p-4">
            <h1 className='text-center mb-8'>Profile</h1>
            <div className="flex justify-center gap-10 mb-20">
               <UserIconName name={userProfileData.name} avatar={userProfileData.avatar} size={30} textClassNames='text-xl font-semibold' />
               <div className='flex items-center gap-2'>
                  <UserGroupIcon className='size-6 mx-1' />
                  <h4>{userProfileData.group?.name}</h4>
               </div>
            </div>

            <div className='flex justify-between my-5'>
               <h3>Score</h3>
               <Amount amount={<h3>{userProfileData.score}</h3>} size={25} color={AmountColor.EmeraldDark} />
            </div>
            <ScoreChart score={userProfileData.score} firstDate={userProfileData.createdAt} data={userTransactions}></ScoreChart>

            {/* <GradientLine className="mb-20" /> */}

            <div className='flex justify-between items-center'>
               <h3>Tickets</h3>
               <div className='flex items-center gap-2 text-xl'>
                  {closedTickets}
                  <TicketIcon className='size-6'></TicketIcon>
                  <p>finished</p>
               </div>
            </div>

            <div className='mt-5'>
               <div className="flex flex-col gap-4">
                  {openTicket ? (
                     <TicketUserOpen ticket={openTicket} user={minimalUserData} />
                  ) : (
                     <CreateTicket />
                  )}
                  <GradientLine className='my-5' />
                  {userTickets.length > 0 ? userTickets.filter(ticket => !ticket.open).map((theTicket) => (
                     <TicketBase key={theTicket.id} ticket={theTicket} user={minimalUserData} />
                  )) : (
                     <div className="opacity-30">
                        <NoTicketsCard />
                     </div>

                  )}
               </div>
            </div>
         </div>
      </AppPage >
   );
}