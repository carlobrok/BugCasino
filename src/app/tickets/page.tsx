// 'use client'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsList from '../components/Ticket/TicketsList';
import { getOpenUserTicket, getUserTickets } from '@/lib/actions/gamedata';
import CreateTicket from '../components/CreateTicket';
import OpenUserTicket from '../components/Ticket/TicketOpenUser';
import GradientLine from '../components/GradientLine';
import AppPage from '../components/AppPage';
import TicketClosedUser from "../components/Ticket/TicketsClosedUser";
import { getUser } from "@/lib/session";
// import { useEffect } from 'react';


export default async function Page({ searchParams }: { searchParams: { open?: string; groupName?: string } }) {
    const session = await getServerSession();

    if (!session) {
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
                            <h1 className="mb-4 text-2xl font-bold">My open Ticket</h1>
                            <OpenUserTicket ticket={openTicket} />
                        </>
                    ) : (
                        <CreateTicket />
                    )}

                    {closedTickets && closedTickets.length > 0 && (
                        <TicketClosedUser tickets={closedTickets} />
                    )}

                    <GradientLine className='my-8' />

                    <div className=''>
                        <h1 className="mb-4 text-2xl font-bold">Other users' Tickets</h1>
                        <TicketsList searchParams={searchParams} />
                    </div>
                </div>
            </AppPage>
        </>
    );
}

