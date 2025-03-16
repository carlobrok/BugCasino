import { getGroupScores } from "@/lib/actions/scoring";
import { TicketIcon, UserIcon } from "@heroicons/react/24/solid";
import UserIconName from "./UserIconName";
import Amount, { AmountColor } from "./Amount";
import GradientLine from "./GradientLine";
import { getRankColor, RankColors } from "@/lib/format-helper";
import { LaurelLeft, LaurelRight } from "./Laurel";
import Link from "next/link";


interface Group {
    name: string;
    users: {
        name: string;
        avatar: string;
        score: number;
        _count: {
            tickets: number;
        };
        id: number;
    }[];
    score: number;
    tickets: number;
}


function GroupCard({ group, rank }: { group: Group, rank: number }) {

    const groupColor = getRankColor(rank) || "bg-zinc-700";
    const textColor = rank <= 3 ? "text-zinc-800" : "";

    return (
        <div className={"relative p-6 rounded-2xl shadow-lg w-120 " + groupColor + " " + textColor}>
            <div className="flex flex-col justify-between items-center h-full">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <div className="w-full flex justify-evenly items-center font-semibold mt-4  text-2xl">
                    <Amount amount={group.score} size={28} color={AmountColor.EmeraldDark} />
                    <div className="flex items-center gap-2">
                        {group.tickets}
                        <TicketIcon className="size-6" />
                    </div>
                </div>
                <GradientLine className="w-full my-3" />
                {group.users.sort((a, b) => b.score - a.score).map((user) => (
                    <div key={user.name} className="w-full flex justify-between items-center">
                        <Link href={`/profile/${user.id}`} className="link-translate">
                            <UserIconName name={user.name} avatar={user.avatar} size={20} />
                        </Link>
                        <div className="flex">
                            <Amount amount={user.score} color={AmountColor.EmeraldDark} />
                            <div className="flex justify-end items-center gap-2 w-15">
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
                <div className="flex items-center gap-4 mb-10">

                    <LaurelLeft className="size-20 fill-white" />
                    <h1 className="text-3xl lg:text-5xl font-bold">Group Leaderboard</h1>
                    <LaurelRight className="size-20 fill-white" />
                </div>

                {groupsScores.sort((a, b) => b.score - a.score).map((group, index) => (

                    <GroupCard key={group.name} group={group} rank={index + 1} />
                ))}
                {/* <GroupCard /> */}
            </div>
        </>
    );
}