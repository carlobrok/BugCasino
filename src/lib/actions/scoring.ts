import { prisma } from '../prisma';

export async function getGroupScores() {
    const t = await prisma.group.findMany({
        select: {
            name: true,
            users: {
                select: {
                    name: true,
                    avatar: true,
                    score: true,
                    // tickets: true,
                    _count: {
                        select: {
                            tickets: true,
                        },
                        
                    },
                },
            },
        },
    });

    console.log(t);
    return t;
}

// returns the reward a player gets if the bet was correct
export function getBetReward(amount: number, correctBet: boolean = false) {
    return correctBet ? 2 * amount : 0;
}

export function getTicketReward(startTime: Date) {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    const minutesPassed = Math.floor((now - start) / 60000);

    // reward = 1 / minute
    return minutesPassed
}