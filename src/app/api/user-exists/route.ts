import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "No E-Mail provided" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  return NextResponse.json({ exists: !!user });
}
