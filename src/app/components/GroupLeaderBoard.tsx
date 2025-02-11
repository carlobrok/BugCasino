import { getGroupScores } from "@/lib/actions/groups";
import { TicketIcon, UserIcon } from "@heroicons/react/24/solid";
import { Emoji } from "emoji-picker-react";
import UserIconName from "./UserIconName";
import Amount from "./Amount";
import GradientLine from "./GradientLine";


interface Group {
    name: string;
    users: {
        name: string;
        avatar: string;
        score: number;
        _count: {
            tickets: number;
        };
    }[];
    score: number;
    tickets: number;
}

export enum RankColors {
    FIRST = "bg-yellow-500/30",
    SECOND = "bg-slate-200/30",
    THIRD = "bg-yellow-900/30"
    // FIRST = "bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"
    // THIRD = "bg-amber-700/20"
}

export enum AmountColor {
    Emerald = "fill-amber-400",
    EmeraldDark = "fill-amber-400 stroke-zinc-700/25",
    Gray = "stroke-zinc-300 stroke-zinc-200/50"
}

function GroupCard({ group, rank }: { group: Group, rank?: number }) {
    const rankColor = rank === 0 ? RankColors.FIRST : rank === 1 ? RankColors.SECOND : RankColors.THIRD;

    return (
        <div className={"relative p-6 rounded-2xl shadow-lg w-96 " + rankColor}>
            <div className="flex flex-col justify-between items-center h-full">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <div className="w-full flex justify-evenly items-center font-semibold mt-4 t  text-2xl">
                    <Amount amount={group.score} size={5} />
                    <div className="flex items-center gap-2">
                        {group.tickets}
                        <TicketIcon className="size-6" />
                    </div>
                </div>
                <GradientLine className="w-full my-3" />
                {group.users.map((user) => (
                    <div key={user.name} className="w-full flex justify-between items-center">


                        <UserIconName name={user.name} avatar={user.avatar} size={20} />
                        <div className="flex" >
                            <Amount amount={user.score} size={4} />
                                <div className="flex items-center gap-2">
                                {user._count.tickets}
                                <TicketIcon className="size-5" />
                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>


        </div>
    );
}

export default async function GroupLeaderBoard() {
    const groupsData = await getGroupScores();

    // calculate the group score based on the user scores
    const groupsScores = groupsData.map((group) => {
        const groupScore = group.users.reduce((acc, user) => acc + user.score, 0);
        const groupTickets = group.users.reduce((acc, user) => acc + user._count.tickets, 0);

        return { ...group, score: groupScore, tickets: groupTickets };
    });



    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">Group Leader Board</h1>
                {groupsScores.sort((a, b) => b.score - a.score).map((group, index) => (

                    <GroupCard key={group.name} group={group} rank={index} />
                ))}
                {/* <GroupCard /> */}
            </div>
        </>
    );
}