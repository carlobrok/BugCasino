"use client";

import { useTransition } from "react";
import { closeUserTicket } from "@/lib/actions/ticket";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CloseTicketButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleClick() {
        // Start a transition so that the UI knows we're in a pending state.
        startTransition(async () => {
            try {
                await closeUserTicket();
            } catch (error) {
                console.error("Error closing ticket:", error);
            }
        });
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="px-3 py-1 bg-green-900 hover:bg-green-800 shadow-md text-white rounded-lg disabled:opacity-50 flex items-center justify-center"
        >
            done
            <CheckIcon className="ml-1 w-6 h-6" />
        </button>
    );
}
