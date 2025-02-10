import LoginRegister from "./components/Login/LoginRegister";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getGroups } from "@/lib/actions/gamedata";

export default async function Home() {

  const session = await getServerSession(authOptions)
  // console.log("session", session);

  const groups = await getGroups();

  if (session) {
    redirect("/leaderboard");
  } else {
    return (
      <div className="relative bg-bug-casino bg-cover bg-center h-screen w-screen text-lg">
        <LoginRegister groups={groups}/>
      </div>
    )
  }
}
