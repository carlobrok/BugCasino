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

export type UserData = Pick<User, "id" | "email" | "name" | "avatar" | "score">;



/**
* Retrieves the current authenticated user from the database.
* Throws an error if the user is not authenticated.
* @returns The current user.
*/
export async function getUser() : Promise<UserData> {
 const session = await getCurrentSession();
 if (!session || !session.user?.email) {
   throw new Error("User is not authenticated");
 }

//  exclude password
 const user = await prisma.user.findUnique({
   where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      score: true,
    },
 });

 if (!user) {
   throw new Error("User not found");
 }

 return user;
}


export async function getMinimalUserData() : Promise<Pick<User, "email"| "name"| "avatar">> {
  const user = await getUser();
  return {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };
}