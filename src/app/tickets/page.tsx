import Header from '../components/Header';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsGrid from '../components/TicketsGrid';
import { getOpenUserTicket, getUserTickets } from '@/lib/actions/gamedata';
import CreateTicket from '../components/CreateTicket';
import OpenUserTicket from '../components/OpenUserTicket';


export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    const ticket = await getOpenUserTicket();

    return (
        <>
            <Header />
            <div className="container max-w-2xl mx-auto p-4 ">
                {ticket ? (
                    <>
                        <h1 className="mb-2 text-2xl font-bold">My Ticket</h1>
                        <OpenUserTicket /> 
                    </>
                ) : (
                    <CreateTicket />
                )}

                <div className='mt-8'>
                    <h1 className="mb-2 text-2xl font-bold">Other users tickets</h1>
                    <TicketsGrid />
                </div>
            </div>
        </>
    );
}

