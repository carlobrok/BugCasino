'use client'

import { useActionState, useEffect, useState } from "react";
import { newTicket } from "@/lib/actions";
import './TimePicker/time-picker.css';
import SubmitButton from "./SubmitButton";
import TimePicker from "./TimePicker/TimePicker";
import { useRouter } from "next/navigation";
import Amount from "./Amount";

const initialState = { error: "", success: undefined, ticket: undefined };

export default function CreateTicket() {

    const [state, formAction, pending] = useActionState(newTicket, initialState);


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
                        maxLength={60}
                        required
                    />
                </div>

                <div className="mt-2">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="lg:flex lg:flex-col lg:w-1/3">
                            <p className="text-lg font-semibold mt-2 lg:mb-2">Deadline</p>
                            <p className="italic"> by which you expect the task to be completed. You earn <Amount amount={1}/> per minute until the deadline. As a bonus you get 10% of the bets placed on your ticket by other players.</p>
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
