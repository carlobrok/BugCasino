import { getScores } from "@/lib/actions/gamedata";
import Amount, { AmountColor } from "./Amount";
import { getCurrentUser } from "@/lib/session";
import GradientLine from "./GradientLine";
import { TrophyIcon } from "@heroicons/react/24/outline";
import UserIconName from "./UserIconName";
import { getRankColor } from "@/lib/format-helper";
import { LaurelLeft, LaurelRight } from "./Laurel";

export default async function ScoreBoard() {

    const scores = await getScores();
    const user = await getCurrentUser();

    if (!user) {
        return <p>Not authenticated</p>;
    }

    return (
        <div className="bg-zinc-700 rounded-2xl px-8 py-6 flex flex-col w-96 gap-1 items-center shadow-lg">
            <div className="flex items-center gap-2">
                <LaurelLeft className="size-10 fill-white" />
                <p className="text-2xl font-bold">Leaderboard</p>
                <LaurelRight className="size-10 fill-white" />
            </div>
            {/* <h1 className="text-2xl w-full text-center font-bold"></h1> */}
            <GradientLine className="my-4 w-64" />
            {scores.map((score, index) => (
                <div key={index} className={
                    "flex justify-between items-center py-1 px-3 rounded-lg w-full"
                    + (index <= 2 ? " text-zinc-800 font-semibold " + getRankColor(index + 1) : "")
                    + (index === 0 ? " bg-orange-200/50" : "")
                    + (index === 1 ? " bg-orange-200/25 " : "")
                    + (index === 2 ? " bg-orange-200/10" : "")
                    + (score.id === user.id ?
                        (index <= 2 ? " border border-zinc-300" :
                            " border border-zinc-300/50 bg-zinc-200/20"
                        ) : "")
                }>
                    <div className="flex items-center ml-2">
                        <p className="w-8">{index + 1}</p>
                        <UserIconName name={score.name} avatar={score.avatar} />
                    </div>
                    <Amount amount={score.score} color={(index <= 2 ? AmountColor.EmeraldDark : AmountColor.Emerald)} />
                </div>
            ))}
        </div>
    );
}