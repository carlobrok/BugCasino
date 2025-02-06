import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

/**
 * Retrieves the current session.
 * @returns The current session or null if not authenticated.
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

/**
 * Retrieves the current authenticated user from the database.
 * @returns The current user or null if not authenticated.
 */
export async function getCurrentUser() : Promise<User | null> {
  const session = await getCurrentSession();
  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}
