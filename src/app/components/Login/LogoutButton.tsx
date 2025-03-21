"use client";

import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { redirect } from "next/navigation";
import { Tooltip } from "../Tooltip";


export default function LogoutButton() {
  return (
    // <div className="bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 mt-4 text-white">

    <Tooltip text="Logout">
      <button
        onClick={() => {
          signOut();
          redirect("/");
        }}
      >
        <ArrowRightStartOnRectangleIcon className="w-6 h-6 fill-red-700 hover:fill-red-600 hover:cursor-pointer" />
      </button>
    </Tooltip>
  );
}
