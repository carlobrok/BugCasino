import { TicketWithDetails } from "@/lib/actions/gamedata";
import { UserData } from "@/lib/session";
import Amount, { AmountColor } from "../Amount";
import { formatDoneInTime } from "@/lib/format-helper";
import { getBetReward, getWinReturnFactor } from "@/lib/actions/scoring";
import { PunctualityLabel } from "./BetsList";

export function TicketUserBet({ ticket, user, userHasBetOnTicket }: { ticket: TicketWithDetails, user: UserData, userHasBetOnTicket: boolean }) {

    let userBet = ticket.bets.find((bet) => bet.userId === user.id);

    if (!userBet) {
        return null;
    }

    const amount = userBet.amount;

    if (userHasBetOnTicket && !ticket.open || ticket.timeEstimate < new Date()) {
        const outcome = userBet.outcome ?? 0;

        if (outcome === 0) {
            return (
                <>
                    <span><Amount amount={amount} color={AmountColor.Emerald} margin={true} /> lost</span>
                </>
            );
        }
        
        
        return (
            <>
                <span><Amount amount={outcome} color={AmountColor.Emerald} margin={true} /> won</span>
            </>
        );
    }

    const bets = ticket.bets;


    const intimePod = bets.filter(bet => bet.doneInTime).reduce((sum, bet) => sum + bet.amount, 0) + 0;
    const delayedPod = bets.filter(bet => !bet.doneInTime).reduce((sum, bet) => sum + bet.amount, 0) + 0;

    // console.log("Intime pod", intimePod, "Delayed pod", delayedPod);

    const expectedReturnFactor = getWinReturnFactor(amount, intimePod, intimePod + delayedPod);
    const expectedWin = getBetReward(amount, amount + intimePod, amount + intimePod + delayedPod);

    return (
        <>
            {userHasBetOnTicket && (
                <>
                    {/* User bet on the ticket */}

                    <span key={userBet.id} className="inline-block text-center">
                        <Amount amount={amount} color={AmountColor.Emerald} margin={true} />
                        on <PunctualityLabel doneInTime={userBet.doneInTime} />
                    </span>

                    <div className="hidden md:flex flex-col items-center mt-2">
                        <p className="italic text-sm">Win prediction </p>
                        <p><Amount amount={expectedWin} />  (x{expectedReturnFactor.toFixed(2)})</p>
                    </div>
                </>
            )}
        </>
    );
}