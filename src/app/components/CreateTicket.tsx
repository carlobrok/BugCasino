'use client'

import { useActionState, useEffect, useState } from "react";
import { newTicket } from "@/lib/actions";
import './TimePicker/time-picker.css';
import SubmitButton from "./SubmitButton";
import TimePicker, { bugCasinoClosed, TimePickerInitialDate } from "./TimePicker/TimePicker";
import { useRouter } from "next/navigation";
import Amount from "./Amount";
import { Tooltip } from "./Tooltip";
import { getMaxTicketTimeReward } from "@/lib/actions/scoring";
import React from "react";
import { BugCasinoTitle } from "./BugCasinoTitle";

const initialState = { error: "", success: undefined, ticket: undefined };

export default function CreateTicket() {

    const [state, formAction, pending] = useActionState(newTicket, initialState);
    
    const { initialDate, initialDayIndex } = TimePickerInitialDate();
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

    if (state.success) {
        return <div>Success</div>;
    }

    return (
        <div className="m-auto max-w-lg lg:max-w-full">
            <div className=" px-15 py-10 rounded-4xl bg-zinc-800">
                {selectedDate && (bugCasinoClosed(selectedDate)) === true ? (
                    <div className="flex flex-col items-center">
                        <BugCasinoTitle />
                        <h4 className="italic mb-3">is now closed - thanks for participating!</h4>
                    </div>
                ) :
                    (
                        <>
                            <h2 className="mb-4">Create a new Ticket</h2>


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
                                            <p className="italic mb-5"> by which you expect the task to be completed. </p>
                                            <Tooltip
                                                text={
                                                    <p>You earn <Amount amount={1} /> per minute until the deadline. As a bonus you get 10% of the bets placed on your ticket by other players.</p>
                                                }
                                            >

                                                {(selectedDate) &&
                                                    <div className="flex flex-col w-full">
                                                        <p className="text-lg font-semibold">Ticket reward: </p>
                                                        <div className="text-right">
                                                            <Amount amount={getMaxTicketTimeReward(new Date(), selectedDate)} />
                                                            <p>+ 10% of bets</p>
                                                        </div>
                                                    </div>
                                                }
                                            </Tooltip>



                                        </div>
                                        <div className="m-auto">
                                            <TimePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} initialDayIndex={initialDayIndex} />
                                        </div>
                                    </div>
                                </div>

                                <SubmitButton pending={pending} />
                            </form>
                        </>
                    )
                }
            </div>
        </div>
    );
}
