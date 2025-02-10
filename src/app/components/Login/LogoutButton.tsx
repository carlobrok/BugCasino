"use client";

import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { redirect } from "next/navigation";


export default function LogoutButton() {
  return (
    // <div className="bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 mt-4 text-white">
    <button
      onClick={() => {
        signOut(); redirect("/");
      }}
    >
      <ArrowRightStartOnRectangleIcon className="w-6 h-6 fill-red-700 hover:fill-red-600" />
    </button>
    // </div>
  );
}
