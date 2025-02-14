import Link from "next/link";
import Amount, { AmountColor } from "./Amount";
import { TicketIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import LogoutButton from "./Login/LogoutButton";
import UserIconName from "./UserIconName";
import { getUser } from "@/lib/session";
import Notifications from "./Notifications";
import HelpPage from "./HelpPage";
import GradientLine from "./GradientLine";

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
    const user = await getUser();

    return (
        <>
            <div className="fixed top-0 left-0 z-10 px-8 pt-6">

                {/* Left side: bug casino title and navigation */}

                <div className="flex flex-col">
                    {/* Left placeholder for spacing */}
                    <div className="">
                        <h1 className={"text-4xl py-2 fugaz-one-regular"
                            + " bg-linear-to-r from-red-600  via-amber-500 to-orange-600"
                            + " inline-block text-transparent bg-clip-text"}>
                            Bug Casino
                        </h1>
                    </div>
                    <div className="flex font-bold text-lg gap-3 my-3">
                    <UserIconName name={user.name} avatar={user.avatar} />                
                    <Amount amount={user.score} color={AmountColor.Emerald} size={6} />
                    </div>

                    <GradientLine className="w-40 my-3"/>

                    {/* Centered navigation links */}
                    <nav className="flex flex-col font-bold space-y-4 mt-4">
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
                    <Notifications />
                    <HelpPage />
                    <LogoutButton />
                </div>
            </div>
        </>
    );
}

export default function AppPage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="relative">
                <SideBars />
                <div className="absolute top-20 w-full">{children}
                    <footer className=" w-full h-40 static bottom-0"></footer>
                </div>
            </div>
        </>
    );
}