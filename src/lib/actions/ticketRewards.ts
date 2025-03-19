import { TicketBetsData } from "../prismaDataTypes";
import { createTransaction, TransactionType } from "../transaction";
import { getBetReward, getTicketReward } from "./scoring";
import { prisma } from "../prisma";

export async function createTicketRewards(ticket : TicketBetsData, doneInTime: boolean, now: Date) {

  const totalPod = ticket.bets.reduce((acc, bet) => acc + bet.amount, 0);
  const winnersPod = ticket.bets.filter(bet => bet.doneInTime === doneInTime).reduce((acc, bet) => acc + bet.amount, 0);

  console.log("Total pod", totalPod, "Winners pod", winnersPod);

  for (const bet of ticket.bets) {
    const correctBet = bet.doneInTime === doneInTime;
    console.log("Bet", bet, "is correct", correctBet);
    
    let betReward = 0;
    if (correctBet) {
      betReward = getBetReward(bet.amount, winnersPod, totalPod);
      console.log("Bet reward", betReward);
    }

    // update Bet 
    await prisma.bet.update({
      where: { id: bet.id },
      data: { outcome: betReward },
    });

    // update User score
    if (correctBet) {
      await createTransaction({ userId: bet.userId, amount: betReward, type: TransactionType.PAYOUT });
    }
  }

  const ticketReward = getTicketReward(ticket.createdAt, now, totalPod);
  const totalReward = ticketReward.timeReward + ticketReward.podReward;

  console.log("Awarding user", ticket.authorId, "total reward", totalReward);

  await createTransaction({ userId: ticket.authorId, amount: totalReward, type: TransactionType.TICKET });
}