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


/**
* Retrieves the current authenticated user from the database.
* Throws an error if the user is not authenticated.
* @returns The current user.
*/
export async function getUser() : Promise<User> {
 const session = await getCurrentSession();
 if (!session || !session.user?.email) {
   throw new Error("User is not authenticated");
 }

 const user = await prisma.user.findUnique({
   where: { email: session.user.email },
 });

 if (!user) {
   throw new Error("User not found");
 }

 return user;
}