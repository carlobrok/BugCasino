import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, name, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Fill all fields first" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Benutzer existiert bereits" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  return NextResponse.json({ id: newUser.id, email: newUser.email });
}