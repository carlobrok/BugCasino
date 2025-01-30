"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
      <div className="bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 mt-4 text-white">
      <button
      onClick={() => signOut()}
    >
      Logout
    </button>
    </div>
  );
}
