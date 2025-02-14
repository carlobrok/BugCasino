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
        <div className="max-w-md m-auto">
            <h2 className="text-2xl font-bold mb-4">Create a new Ticket</h2>

            <form action={formAction}>
                <div >
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="mt-1 block w-full px-4 p-2 bg-zinc-700 rounded-md focus:border-pink-600"
                        placeholder="Enter the title"
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="mt-2">
                    <label className="block text-sm font-medium">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Some short description"
                        className="mt-1 block bg-zinc-700 w-full border-gray-70 px-4 p-2  rounded-md"
                        required
                    />
                </div>

                <div className="mt-2">
                    <TimePicker />
                </div>

                <SubmitButton pending={pending} />
            </form>
        </div>
    );
}
