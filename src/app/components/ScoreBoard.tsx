import { getScores } from "@/lib/actions/gamedata";
import Amount, { AmountColor } from "./Amount";
import { getCurrentUser } from "@/lib/session";
import GradientLine from "./GradientLine";
import { TicketIcon } from "@heroicons/react/24/solid";
import UserIconName from "./UserIconName";
import { getRankColor } from "@/lib/format-helper";
import { LaurelLeft, LaurelRight } from "./Laurel";
import Link from "next/link";

export default async function ScoreBoard() {

    const userScores = await getScores();
    const user = await getCurrentUser();

    if (!user) {
        return <p>Not authenticated</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
                <LaurelLeft className="size-20 fill-white" />
                    <span className="text-5xl font-bold">Leaderboard</span>
                <LaurelRight className="size-20 fill-white" />
            </div>
            <GradientLine className="my-4 w-80" />

            <div className="bg-zinc-700 rounded-2xl p-8 flex flex-col w-150 gap-1 items-center shadow-lg">
                {userScores.map((userScore, index) => (
                    <Link key={index} className={
                        "flex justify-between items-center py-1 px-3 rounded-lg w-full"
                        + (index <= 2 ? " text-zinc-800 font-semibold " + getRankColor(index + 1) : "")
                        + (userScore.id === user.id ?
                            (index <= 2 ? " border border-zinc-300" :
                                " border border-zinc-300/50 bg-zinc-200/20"
                            ) : "")
                    } 
                    href={`/profile/${userScore.id}`}
                    >
                        <div className="flex items-center ml-2 link-translate w-full h-full">
                            <p className="w-8">{index + 1}</p>
                            <UserIconName name={userScore.name} avatar={userScore.avatar} />
                        </div>
                        <div className="flex" >
                            <Amount amount={userScore.score} color={(index <= 2 ? AmountColor.EmeraldDark : AmountColor.Emerald)} />
                            <div className="flex justify-end items-center gap-2 w-15">
                                {userScore._count.tickets}
                                <TicketIcon className="size-5" />
                            </div>
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    );
}