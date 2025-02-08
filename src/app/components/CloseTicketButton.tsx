"use client";

import { useTransition } from "react";
import { closeUserTicket } from "@/lib/actions/ticket";
import { CheckIcon } from "@heroicons/react/24/outline"; // Install heroicons: npm install @heroicons/react
import { useRouter } from "next/navigation";

export default function CloseTicketButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleClick() {
        // Start a transition so that the UI knows we're in a pending state.
        startTransition(async () => {
            try {
                await closeUserTicket();
                // After the ticket is closed, refresh the page to show the updated state.
                router.refresh(); 
            } catch (error) {
                console.error("Error closing ticket:", error);
            }
        });
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 flex items-center justify-center"
        >
            <CheckIcon className="w-6 h-6" />
        </button>
    );
}
