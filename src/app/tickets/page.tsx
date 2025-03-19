import { redirect } from "next/navigation";
import TicketsList from '../components/Ticket/TicketsList';
import { getOpenUserTicket, getUserTickets } from '@/lib/actions/gamedata';
import CreateTicket from '../components/CreateTicket';
import TicketUserOpen from '../components/Ticket/TicketOpenUser';
import GradientLine from '../components/GradientLine';
import AppPage from '../components/AppPage';
import { getUser } from "@/lib/session";

interface PageProps {
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams; // Await the promise
    const user = await getUser();
    if (!user) {
        redirect("/");
    }

    const openTicket = await getOpenUserTicket();
    // const closedTickets = await getUserTickets(true);

    return (
        <>
            <AppPage>
                <div className="container max-w-2xl mx-auto p-4 ">
                    {openTicket ? (
                        <>
                            <h2 className="mb-4">My open Ticket</h2>
                            <TicketUserOpen ticket={openTicket} user={user} />
                        </>
                    ) : (
                        <CreateTicket />
                    )}

                    <GradientLine className='my-8' />

                    <div className=''>
                        <h2 className="mb-4">Other users' Tickets</h2>
                        <TicketsList searchParams={resolvedSearchParams} />
                    </div>
                </div>
            </AppPage>
        </>
    );
}

