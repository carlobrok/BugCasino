import { assert } from "console";
import LoginRegister from "./components/LoginRegister";
import LogoutButton from "./components/LogoutButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {

  const session = await getServerSession(authOptions)
  console.log("session", session);

  if (session) {
    redirect("/dashboard");
  } else {
    return (
      <div className="bg-bug-casino bg-cover bg-center h-screen text-lg">
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
          <LoginRegister />
        </main>
      </div>
    )
  }
}



// I want to create a login form using next-auth and the prismaAdapter. prisma is using a local sqlite database. i am using the next app router. 

// these are the versions i am using:
// next-auth@4.24.11
// prisma@6.3.0
// next@15.1.6 
// react@19.0.0

// this is how the tree of my installation looks like:
// ├── package-lock.json
// ├── package.json
// ├── postcss.config.mjs
// ├── prisma
// │   ├── dev.db
// │   └── schema.prisma
// ├── public
// │   ├── file.svg
// │   ├── globe.svg
// │   ├── next.svg
// │   ├── vercel.svg
// │   └── window.svg
// ├── src
// │   ├── app
// │   │   ├── api
// │   │   │   ├── auth
// │   │   │   │   └── [...nextauth]
// │   │   │   │       └── route.ts
// │   │   │   ├── register
// │   │   │   │   └── route.ts
// │   │   │   └── user-exists
// │   │   │       └── route.ts
// │   │   ├── components
// │   │   │   ├── LoginRegister.tsx
// │   │   │   └── LogoutButton.tsx
// │   │   ├── favicon.ico
// │   │   ├── globals.css
// │   │   ├── layout.tsx
// │   │   └── page.tsx
// │   └── lib
// │       └── prisma.ts
// ├── tailwind.config.ts
// └── tsconfig.json

// on the landing page a login/register form must be presented when a user is not logged in. this is provided by the loginregister component. It should handle the login/register flow as follows:
//   1. only a input for email + button "login" is visible.
//   2. after clicking on the "login" button, the api endpoint user-exists is called to check whether the user is already registered
//   3.a) if the user is already registered: a new input field for the password is shown.
//   3.b) if the user does not exist yet, two fields for name and Password are shown.
//   4. after the login / register process, the user must be logged in and a session, e.g. by using jwt must be created. so when the user accesses the website next time, he is still logged in


// scheme.prisma
// ```
// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider = "sqlite"
//   url      = env("DATABASE_URL")
// }

// model User {
//   id        Int      @id @default(autoincrement())
//   email     String   @unique
//   password  String
//   name      String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
// ```


// app/api/register/route.ts  (this definitely works, registered users show up in the database)
// ```
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   const { email, name, password } = await req.json();

//   if (!email || !password) {
//     return NextResponse.json({ error: "E-Mail und Passwort erforderlich" }, { status: 400 });
//   }

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     return NextResponse.json({ error: "Benutzer existiert bereits" }, { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = await prisma.user.create({
//     data: { email, name, password: hashedPassword },
//   });

//   return NextResponse.json({ id: newUser.id, email: newUser.email });
// }
// ```

// app/api/user-exists/route.ts   ( this works too, a registered user is found and if the email is registered only the password input is shown in the loginregister component ) 
// ```
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   const { email } = await req.json();

//   if (!email) return NextResponse.json({ error: "Email erforderlich" }, { status: 400 });

//   const user = await prisma.user.findUnique({ where: { email } });
//   return NextResponse.json({ exists: !!user });
// }

// ```


// app/components/LoginRegister.tsx   
// ```
// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginRegister() {
    
//     const [email, setEmail] = useState("");
//     const [name, setName] = useState("");
//     const [password, setPassword] = useState("");
//     const [showLogin, setShowLogin] = useState(false);
//     const [showRegister, setShowRegister] = useState(false);
//     const [error, setError] = useState("");
//     const router = useRouter();

//     const checkUserExists = async () => {
//         const res = await fetch("/api/user-exists", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//         });

//         if (res.ok) {
//         const data = await res.json();
//         if (data.exists) {
//             setShowLogin(true);
//         } else {
//             setShowRegister(true);
//         }
//         }
//     }
    
//     const registerUser = async () => {
//         const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, name, password }),
//         });

//         if (res.ok) {
//         router.refresh();
//         }
//         else if (res.status === 400) {
//         const data = await res.json();
//         setError(data.error);
//         }

//     }


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
    
//         const result = await signIn("credentials", {
//           redirect: false,
//           email,
//           password,
//         });
    
//         if (result?.error) {
//           setError(result.error);
//         } else if (result?.ok) {
//           router.refresh();
//         }
//     };
    
//     return (
//         <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
//         <h1 className="text-xl font-bold">Login</h1>
//         <form onSubmit={handleSubmit} className="mt-4">
//             <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-2 border rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             />
//             {!showLogin && !showRegister && (
//             <button
//                 type="button"
//                 className="w-full mt-2 bg-blue-500 text-white py-2 rounded"
//                 onClick={checkUserExists}
//             >
//                 Login
//             </button>
//             )}
//             {showLogin && (
//             <>
//                 <input
//                 type="password"
//                 placeholder="Passwort"
//                 className="w-full p-2 border rounded mt-2"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 />
//                 <button type="submit" className="w-full mt-2 bg-green-500 text-white py-2 rounded">
//                 Anmelden
//                 </button>
//             </>
//             )}
//             {showRegister && (
//             <>  
//                 <input
//                 type="text"
//                 placeholder="Name"
//                 className="w-full p-2 border rounded mt-2"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 />
//                 <input
//                 type="password"
//                 placeholder="Passwort"
//                 className="w-full p-2 border rounded mt-2"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 />
//                 <button type="button" onClick={registerUser} className="w-full mt-2 bg-green-500 text-white py-2 rounded">
//                 Anmelden
//                 </button>
//             </>
//             )}


//             {error && <p className="text-red-500 mt-2">{error}</p>}
//         </form>
//         </div>
//     );
// }
// ```


// app/api/auth/[...nextauth]/route.ts   ( there is probalby a problem here creating the session, as the session variable that can be retrieved with `getServerSession` is null after the auth procedure )
// ```
// import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { NextAuthOptions } from "next-auth"
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { prisma } from "@/lib/prisma"

// import bcrypt from "bcrypt"


// export const authOptions : NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", required: true },
//         password: { label: "Password", type: "password", required: true },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("E-Mail und Passwort erforderlich");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           throw new Error("User does not exist");
//         }

//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         console.log("user", user, "credentials", credentials);

//         return { id: user.id.toString(), email: user.email, name: user.name };
//       },
//     }),
//   ],
//   session: { 
//     strategy: "jwt"
//   },
//   callbacks: {
//     async jwt({token, user} : {token: any, user: any}) {
//       console.log("jwt", token, user);
//       return {...token, ...user}
//     },
//     // async session({ session, token, user }y) {
//     //   if (session.user) {
//     //     console.log("session.user", session.user);
//     //     console.log("token", token);
//     //     session.user.id = token.sub;
//     //   }
//     //   console.log("session", session);
//     //   return session;
//     // },
//   }
// };

// export default NextAuth(authOptions)
// ```

// app/page.tsx ( here the problem is noticable. after going through the login form the session is still null )
// ```
// import { assert } from "console";
// import LoginRegister from "./components/LoginRegister";
// import LogoutButton from "./components/LogoutButton";
// import { getServerSession } from "next-auth";

// import { authOptions } from "./api/auth/[...nextauth]/route";

// export default async function Home() {

//   const session = await getServerSession(authOptions)
//   console.log("session", session);

//   if (session) {
//     console.log("session", session);

//     return (
//       <main className="flex flex-col items-center justify-center min-h-screen p-4">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Hello, {session.user.name}</h1>
//           <LogoutButton />
//         </div>
//       </main>
//     )
//   } else {
//     return (
//       <main className="flex flex-col items-center justify-center min-h-screen p-4">
//         <LoginRegister />
//       </main>
//     )
//   }
// }
// ```


// please solve my not working auth procedure.