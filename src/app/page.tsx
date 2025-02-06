import LoginRegister from "./components/LoginRegister";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {

  const session = await getServerSession(authOptions)
  console.log("session", session);

  if (session) {
    redirect("/dashboard");
  } else {
    return (
      <div className="bg-bug-casino bg-cover bg-center h-screen text-lg">
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
          <LoginRegister />
        </main>
      </div>
    )
  }
}
