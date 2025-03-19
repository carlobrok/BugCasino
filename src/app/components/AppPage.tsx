import Link from "next/link";
import { AmountColor } from "./Amount";
import { TicketIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import LogoutButton from "./Login/LogoutButton";
import UserIconName from "./UserIconName";
import Notifications from "./Notifications";
import HelpPage from "./HelpPage";
import GradientLine from "./GradientLine";
import { Coins } from "lucide-react";
import { getUserScore } from "@/lib/actions/gamedata";
import { BugCasinoTitle } from "./BugCasinoTitle";


function SideBarLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-white link-translate">
            <div className="flex items-center gap-x-2">
                {children}
            </div>
        </Link>
    );
}

async function SideBarDynamic() {
    const user = await getUserScore();

    return (
        <Link href={"/profile"} className="link-translate">
            <UserIconName name={user.name} avatar={user.avatar} size={30} textClassNames="ml-3 text-xl" />
            {/* <Amount amount={user.score} color={AmountColor.Emerald} size={6} /> */}

            <div className="flex items-center gap-x-3">
                <Coins className={AmountColor.Emerald} color="#fffbeb" size={30} />
                {/* < className={`size-${size} w-${size} ml-1 ${color} drop-shadow-md`} /> */}
                <p className="text-xl">{user.userScore}</p>
            </div>

            <div className="flex items-center gap-x-3">
                {/* <TicketIcon className={`size-${size} w-${size} ml-1 ${color} drop-shadow-md`} /> */}
                <TicketIcon className="size-8 drop-shadow-md" />
                <p className="text-xl">{user.closedTickets}</p>
            </div>
        </Link>
    );
}

export function SideBars() {

    return (
        <>
            <div className="fixed top-0 left-0 z-10 px-8 pt-6">

                {/* Left side: bug casino title and navigation */}

                <div className="flex flex-col font-bold gap-y-2">
                    {/* Left placeholder for spacing */}
                    
                    <BugCasinoTitle />

                    <SideBarDynamic />

                    <GradientLine className="w-20 my-3" />

                    {/* Centered navigation links */}
                    <nav className="flex flex-col font-bold space-y-4">
                        <SideBarLink href="/tickets"><TicketIcon className="size-6" />Tickets</SideBarLink>
                        <SideBarLink href="/leaderboard"><TrophyIcon className="size-6" />Leaderboard</SideBarLink>
                        <SideBarLink href="/groups"><UserGroupIcon className="size-6" />Groups</SideBarLink>
                        {/* <SideBarLink href="/slots">Slots</SideBarLink> */}
                    </nav>
                </div>
            </div>
            <div className="fixed top-0 right-0 z-10 px-8 pt-6">


                {/* Right side: stats, event and logout */}

                <div className="flex justify-end font-bold items-center gap-x-4">
                    {/* <Notifications />
                    <HelpPage /> */}
                    <LogoutButton />
                </div>
            </div>
        </>
    );
}

export default function AppPage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="absolute top-20 right-8 w-3/4 md:5/6 lg:w-full ">
                {children}
                <footer className=" w-full h-40 static bottom-0"></footer>
            </div>
        </>
    );
}