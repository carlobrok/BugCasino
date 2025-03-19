import { createTicketRewards } from '@/lib/actions/ticketRewards';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { prisma } from '@/lib/prisma';

console.log('Starting cron job to check for expired tickets...');

// check every 20 seconds
cron.schedule('*/20 * * * * *', async () => {
    const now = new Date();
    const delayedTickets = await prisma.ticket.findMany({
        include: {
            bets: { select: { id: true, userId: true, doneInTime: true, amount: true } },
        },
        where: {
            open: true,
            timeEstimate: {
                lte: now,
            },
        }
    });

    if (delayedTickets.length > 0) {
        console.log(`Closing ${delayedTickets.length} expired tickets.`);

        // reward the winners
        for (const ticket of delayedTickets) {
            await prisma.ticket.update({
                where: { id: ticket.id },
                data: {
                    open: false,
                    finishedAt: now,
                    finishedInTime: false
                },
            });

            await createTicketRewards(ticket, false, now);
        }
    }
});
