import { getCurrentUser, getUser } from '@/lib/session';
import AppPage from '../components/AppPage';
import { ScoreChart } from '../components/ScoreChart';
import { getUserTransactions, TransactionType } from '@/lib/transaction';
import UserIconName from '../components/UserIconName';
import GradientLine from '../components/GradientLine';
import { getGroupName, getUserScore } from '@/lib/actions/gamedata';
import { TicketIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import Amount, { AmountColor } from '../components/Amount';


export default async function ProfilePage() {

   const user = await getCurrentUser();

   const userScore = await getUserScore();

   if (!user) {
      return <AppPage>Unauthorized</AppPage>;
   }

   const groupName: string = await getGroupName(user.groupId);
   const userTransactions = await getUserTransactions({ userId: user.id });

   // const chartData = userTransactions.map((transaction) => {
   //    return {
   //       date: transaction.createdAt,
   //       value: (transaction.type == TransactionType.PAYOUT ? transaction.amount : - transaction.amount),
   //    };
   // });

   return (
      <AppPage>
         <div className='w-2xl m-auto'>
            <h1 className='text-center mb-8'>Profile</h1>
            <div className="flex justify-center gap-10 mb-20">
               <UserIconName name={user.name} avatar={user.avatar} size={30} textClassNames='text-xl font-semibold' />
               <div className='flex items-center gap-2'> 
                  <UserGroupIcon className='size-6 mx-1' /> 
                  <h4>{groupName}</h4>
               </div>
            </div>

            <div className='flex justify-between my-5'>
               <h3>Score</h3>
               <Amount amount={<h3>{user.score}</h3>} size={25} color={AmountColor.EmeraldDark} />
            </div>
            <ScoreChart score={user.score} firstDate={user.createdAt} data={userTransactions}></ScoreChart>

            {/* <GradientLine className="mb-20" /> */}

            <div className='flex justify-between items-center'>

               <h3>Tickets</h3>
               <div className='flex items-center gap-2 text-xl'>
                  {userScore.closedTickets}
                  <TicketIcon className='size-6'></TicketIcon>
                  <p>finished</p>
               </div>
            </div>
         </div>
      </AppPage>
   );
}