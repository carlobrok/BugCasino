import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getUserScore } from "@/lib/actions/gamedata";
import Amount from "./Amount";


export default async function Header() {

  const userScore = await getUserScore();


  return (
    <header className="font-bold p-4 grid grid-cols-3 items-center sticky top-0 backdrop-blur-md z-10">
      {/* Left placeholder for spacing */}
      <div className="w-24">Bug Casino</div>

      {/* Centered navigation links */}
      <nav className="flex justify-center space-x-6 text-bold ">
        <Link href="/dashboard" className="hover:text-gray-400">Home</Link>
        <Link href="/tickets" className="hover:text-gray-400">Tickets</Link>
        <Link href="/profile" className="hover:text-gray-400">Profile</Link>
      </nav>

      {/* Logout button on the right */}

      <div className="flex justify-end items-center space-x-6">
        <Amount amount={userScore} color={true} />
        {/* <p className="ml-6 mr-2">Logout</p> */}
        <LogoutButton />
      </div>
    </header>
  );
}

