'use client'

import { useActionState, useEffect, useState } from "react";
import { newTicket } from "@/lib/actions";
import './TimePicker/time-picker.css';
import SubmitButton from "./SubmitButton";
import TimePicker from "./TimePicker/TimePicker";
import { useRouter } from "next/navigation";

const initialState = { error: "", success: undefined, ticket: undefined };

export default function CreateTicket() {
    const pickerDefaultValue: string = '10:00';

    const [state, formAction, pending] = useActionState(newTicket, initialState);
    const router = useRouter();

    if (state.success) {
        return <div>Success</div>;
    }

    return (
        
            <form action={formAction}>
                <div >
                    <label className="block text-lg font-semibold">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="mt-1 block w-full px-4 p-2 bg-zinc-700 rounded-md"
                        placeholder="Enter the title"
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="mt-2">
                    <label className="block text-lg font-semibold">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Some short description"
                        className="mt-1 block bg-zinc-700 w-full border-gray-70 px-4 p-2  rounded-md"
                        required
                    />
                </div>

                <div className="mt-2">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="lg:flex lg:flex-col lg:w-1/3">
                            <p className="text-lg font-semibold mt-2 lg:mb-2">Estimated time</p>
                            <p className="italic">when you think you have completed the ticket. You will continue to earn coins after this time.</p>
                        </div>
                        <div className="m-auto">
                            <TimePicker />
                        </div>
                    </div>
                </div>

                <SubmitButton pending={pending} />
            </form>
        
    );
}
