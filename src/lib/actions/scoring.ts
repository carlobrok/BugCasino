import { min } from 'date-fns/min';
import { prisma } from '../prisma';

export async function getGroupScores() {
    const t = await prisma.group.findMany({
        select: {
            name: true,
            users: {
                select: {
                    name: true,
                    id: true,
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
export function getBetReward(betAmount: number, specificPodAmount: number, totalPodAmount: number) {
          
    return Math.ceil((betAmount / specificPodAmount) * totalPodAmount);
}

export type TicketReward = {
    timeReward: number;
    podReward: number;
}

export function getMaxTicketTimeReward(startTime: Date, endTime: Date) {
    // ignore the seconds
    startTime.setSeconds(0);
    endTime.setSeconds(0);
    const minutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

    return minutes;
}

export function getTicketReward(startTime: Date, endTime: Date, pod: number) : TicketReward {
    
    // calculate the time passed since the ticket was created or until the tickets deadline
    const now = new Date();
    const tmax = min([now, endTime]).getTime();
    
    const start = new Date(startTime).getTime();
    const minutesPassed = Math.floor((tmax - start) / 60000);

    // reward = 1 / minute + 10% of the pod
    return {
        timeReward: minutesPassed,
        podReward: Math.floor(0.1 * pod)
    }
}

export function getWinReturnFactor(betAmount: number, specificPodAmount: number, totalPodAmount: number) { 
    return (1 / (betAmount + specificPodAmount)) * (betAmount + totalPodAmount);
}