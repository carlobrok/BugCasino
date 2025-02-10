'use server'

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { User } from "@prisma/client";
import { getOpenUserTicket, getUserTickets } from "@/lib/actions/gamedata";
import bcrypt from "bcrypt";


export async function newTicket(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const timeEstimate = formData.get('time') as string;

    console.log("creating ticket", title, description, timeEstimate);

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

    if (!title || !description || !timeEstimate) {
        // console.log("missing fields", title, description, timeEstimate);
        return { error: "Please fill out all fields" };
    }

    const ticket = await prisma.ticket.create({
        data: { title, description, authorId: user.id, timeEstimate }
    });

    // console.log(ticket);

    return { success: true, ticket };
}


export async function checkUserExists(prevState: any, formData: FormData) {
    const mail = formData.get('email') as string;

    // console.log("checking user", mail);

    const user = await prisma.user.findUnique({ where: { email: mail } });

    // console.log("user", user);

    if (!user) {
        return { step: 'register', email: mail };
    }

    return { step: 'login', email: mail };
}


export async function registerUser(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // Get group id from form data and convert it to a number (if provided)
    const groupValue = formData.get("group") as string;
    const groupId = groupValue ? Number(groupValue) : null;
    const name = formData.get("name") as string;

    console.log("registering user", email, name, groupId);

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { email, password: hashedPassword, name, groupId },
    });

    return { step: "register", email };
}