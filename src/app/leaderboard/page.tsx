import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ScoreBoard from '../components/ScoreBoard';
import AppPage from '../components/AppPage';


export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    return (
        <AppPage>
            <div className="flex justify-center items-center h-full">
            <ScoreBoard />
            </div>
        </AppPage>
    );
    }