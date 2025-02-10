import { getScores } from "@/lib/actions/gamedata";
import Amount, { AmountColor } from "./Amount";
import { getCurrentUser } from "@/lib/session";
import GradientLine from "./GradientLine";
import { TrophyIcon } from "@heroicons/react/24/solid";

export default async function ScoreBoard() {

    const scores = await getScores();
    const user = await getCurrentUser();

    if (!user) {
        return <p>Not authenticated</p>;
    }

    return (
        <div className="bg-zinc-700 rounded-2xl px-8 py-6 flex flex-col w-96 gap-1 items-center shadow-lg">
            <TrophyIcon className="size-8"/>
            {/* <h1 className="text-2xl w-full text-center font-bold"></h1> */}
            <GradientLine className="my-4 w-64" />
            {scores.map((score, index) => (
                <div key={index} className={
                    "flex justify-between items-center py-1 px-3 rounded-lg w-full"
                    + (index <= 2 ? " text-white font-semibold" : "")
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
                        <p>{score.name}</p>
                    </div>
                    <Amount amount={score.score} color={(index === 0 ? AmountColor.Emerald : AmountColor.Emerald)} />
                </div>
            ))}
        </div>
    );
}