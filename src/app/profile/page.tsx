import { getCurrentUser, getUser } from '@/lib/session';
import AppPage from '../components/AppPage';
import AvatarPicker from '../components/AvatarPicker';
import { ScoreChart } from '../components/ScoreChart';
import { User } from '@prisma/client';
import { getUserTransactions, TransactionType } from '@/lib/transaction';


export default async function ProfilePage() {

   const user = await getCurrentUser();

   if (!user) {
      return <AppPage>Unauthorized</AppPage>;
   }

   const userTransactions = await getUserTransactions({ userId: user.id }); 

   const chartData = userTransactions.map((transaction) => {
      return {
         date: transaction.createdAt,
         value: (transaction.type == TransactionType.PAYOUT ?  transaction.amount : - transaction.amount),
      };
   });

   return (
      <AppPage>
         <div className="flex flex-col items-center justify-between">
            <h1>Profile Page</h1>


            <AvatarPicker></AvatarPicker>

         </div>
         <ScoreChart score={user.score} firstDate={user.createdAt} data={chartData}></ScoreChart>
      </AppPage>
   );
}