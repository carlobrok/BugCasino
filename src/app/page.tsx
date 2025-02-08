import LoginRegister from "./components/LoginRegister";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {

  const session = await getServerSession(authOptions)
  // console.log("session", session);

  if (session) {
    redirect("/dashboard");
  } else {
    return (
      <div className="relative bg-bug-casino bg-cover bg-center h-screen w-screen text-lg">
        <LoginRegister />
      </div>
    )
  }
}
