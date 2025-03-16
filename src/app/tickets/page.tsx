// 'use client'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsList from '../components/Ticket/TicketsList';
import { getOpenUserTicket, getUserTickets } from '@/lib/actions/gamedata';
import CreateTicket from '../components/CreateTicket';
import TicketUserOpen from '../components/Ticket/TicketOpenUser';
import GradientLine from '../components/GradientLine';
import AppPage from '../components/AppPage';
import TicketClosedUser from "../components/Ticket/TicketsClosedUser";
import { getCurrentUser, getUser } from "@/lib/session";

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
    const closedTickets = await getUserTickets(true);

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
                        <div className="m-auto max-w-lg lg:max-w-full">
                            <h2 className="mb-4">Create a new Ticket</h2>
                            <div className=" px-15 py-10 rounded-4xl bg-zinc-800">
                                <CreateTicket />
                            </div>
                        </div>
                    )}

                    {closedTickets && closedTickets.length > 0 && (
                        // <TicketClosedUser tickets={closedTickets} />
                        <></>
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

