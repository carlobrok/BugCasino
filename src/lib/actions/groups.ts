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
