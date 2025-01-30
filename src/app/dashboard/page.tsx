import Header from '../components/Header';
import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div>
            <Header />
            <h1>Dashboard</h1>

            
        </div>
    );
    }

