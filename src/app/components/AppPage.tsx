import Link from "next/link";
import Amount, { AmountColor } from "./Amount";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import LogoutButton from "./Login/LogoutButton";
import { getUserScore } from "@/lib/actions/gamedata";

export async function SideBars() {

    const { name, userScore } = await getUserScore();
    
    return (
        <div className="fixed top-0 left-0 right-0 z-10 px-8 pt-6">
            <div className="flex justify-between">

                {/* Left side: bug casino title and navigation */}

                <div className="flex flex-col">
                    {/* Left placeholder for spacing */}
                    <div className="">
                        <h1 className="text-3xl py-2 text-zinc-200 fugaz-one-regular">Bug Casino</h1>
                    </div>

                    {/* Centered navigation links */}
                    {/* <nav className="flex flex-col justify-center space-x-6 text-bold "> */}
                        <Link href="/dashboard" className="hover:text-gray-400">Home</Link>
                        <Link href="/tickets" className="hover:text-gray-400">Tickets</Link>
                        <Link href="/profile" className="hover:text-gray-400">Profile</Link>
                    {/* </nav> */}
                </div>



                {/* Right side: stats, event and logout */}

                <div className="flex justify-end items-center space-x-6">
                    {/* <p className="mt-4"> Hi {name}!</p> */}
                    <Amount amount={userScore} color={AmountColor.Emerald} size={6} />
                    <QuestionMarkCircleIcon className="w-6 h-6 mr-1" />
                    <LogoutButton />
                </div>


            </div>
        </div>
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