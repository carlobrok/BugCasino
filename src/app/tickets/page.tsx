import Header from '../components/Header';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsGrid from '../components/TicketsGrid';
import { getOpenUserTicket, getUserTickets } from '@/lib/gamedata';
import CreateTicket from '../components/CreateTicket';
import TicketCard from '../components/TicketCard';
import { Ticket } from '@prisma/client';


export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    const ticket = await getOpenUserTicket();
    
    return (
        <div>
            <Header />

            {ticket ? (
                <TicketCard ticket={ticket} /> // Show the ticket
            ) : (
                <CreateTicket /> // Show form if no open ticket
            )}

            <TicketsGrid />
        </div>
    );
    }

