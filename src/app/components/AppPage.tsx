import Link from "next/link";
import Amount, { AmountColor } from "./Amount";
import { QuestionMarkCircleIcon, TicketIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import LogoutButton from "./Login/LogoutButton";
import { getUserScore } from "@/lib/actions/gamedata";

function SideBarLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-gray-400 hover:">
            <div className="flex items-center gap-x-2">
                {children}
            </div>
        </Link>
    );
}


async function SideBars() {
    const { name, userScore } = await getUserScore();

    return (
        <>
            <div className="fixed top-0 left-0 z-10 px-8 pt-6">

                {/* Left side: bug casino title and navigation */}

                <div className="flex flex-col">
                    {/* Left placeholder for spacing */}
                    <div className="">
                        <h1 className="text-3xl py-2 text-zinc-200 fugaz-one-regular">Bug Casino</h1>
                    </div>

                    {/* Centered navigation links */}
                    <nav className="flex flex-col font-bold space-y-2 mt-4">
                        <SideBarLink href="/tickets"><TicketIcon className="size-6" />Tickets</SideBarLink>
                        <SideBarLink href="/leaderboard"><TrophyIcon className="size-6" />Leaderboard</SideBarLink>
                        <SideBarLink href="/groups"><UserGroupIcon className="size-6" />Groups</SideBarLink>
                        {/* <SideBarLink href="/slots">Slots</SideBarLink> */}
                    </nav>
                </div>
            </div>
            <div className="fixed top-0 right-0 z-10 px-8 pt-6">


                {/* Right side: stats, event and logout */}

                <div className="flex justify-end items-center space-x-6">
                    <p>{name}</p>
                    <Amount amount={userScore} color={AmountColor.Emerald} size={6} />
                    <QuestionMarkCircleIcon className="w-6 h-6 mr-1" />
                    <LogoutButton />
                </div>


            </div>
        </>
    );
}

export default function AppPage({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            <SideBars />
            <div className="absolute top-20 w-full">{children}</div>
            <footer className="w-full h-40 static bottom-0"></footer>
        </div>
    );
}