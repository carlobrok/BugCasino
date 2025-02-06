'use client'

import { useActionState, useState } from "react";
import { newTicket } from "@/app/actions";
import './time-picker/time-picker.css';
import SubmitButton from "./SubmitButton";
import TimePicker from "./time-picker/TimePicker";

const initialState = { error: "", success: undefined, ticket: undefined };

export default function CreateTicket() {
    const pickerDefaultValue: string = '10:00';

    const [state, formAction, pending] = useActionState(newTicket, initialState);
    const [timeInputValue, setTimeInputValue] = useState<string>(pickerDefaultValue);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create a new Ticket</h2>

            <form action={formAction}>
                <div >
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="mt-1 block w-full p-2 border  rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Short Description</label>
                    <input
                        type="text"
                        name="description"
                        className="mt-1 block w-full p-2 border  rounded-md"
                        required
                    />
                </div>

                <div className="mt-4">
                    <div className="time-picker-popup">
                        <TimePicker />
                        {/* <TimePickerSelection {...params} /> */}
                    </div>
                </div>

                <SubmitButton pending={pending} />
            </form>
        </div>
    );
}
