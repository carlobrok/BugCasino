'use server'

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { User } from "@prisma/client";
import { getOpenUserTicket, getUserTickets } from "@/lib/actions/gamedata";
import bcrypt from "bcrypt";
import { RegisterFormData } from "@/app/components/Login/LoginRegister";


export async function newTicket(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    // const description = formData.get('description') as string;
    const timeEstimate = formData.get('time') as string;

    console.log("creating ticket", title, timeEstimate);

    const user: User | null = await getCurrentUser();
    if (!user) {
        // console.log("user not authenticated");
        return { error: "You are not authenticated" };
    }

    const userTicket = await getOpenUserTicket();
    if (userTicket) {
        console.log("user has open ticket", userTicket);
        return { error: "You already have an open ticket" };
    }

    if (!title || !timeEstimate) {
        // console.log("missing fields", title, description, timeEstimate);
        return { error: "Please fill out all fields" };
    }

    const ticket = await prisma.ticket.create({
        data: { title, authorId: user.id, timeEstimate }
    });

    // console.log(ticket);

    return { success: true, ticket };
}


export async function checkUserExists(prevState: any, formData: RegisterFormData) {
    const mail = formData.email;

    // console.log("checking user", mail);
    
    const user = await prisma.user.findUnique({ where: { email: mail } });

    // console.log("user", user);

    if (!user) {
        return { step: 'register', email: mail };
    }

    return { step: 'login', email: mail };
}


export async function registerUser({email, password, name, groupId, avatar}: {email: string, password: string, name: string, groupId: number, avatar: string}) {

    console.log("registering user", email, name, groupId,);

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { email, password: hashedPassword, name, groupId, avatar },
    });

    return { step: "register", email };
}