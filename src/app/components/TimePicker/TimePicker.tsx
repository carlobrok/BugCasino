"use client";

import React, { useState } from 'react';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';
import DayWheel from './DayWheel';
import { timeFrames } from '@/lib/timeManagement';

// ========== relevant code for time restriction ==========


/**
 * This method ensures that the given date is within the available time frames and always in the future.
 * It also rounds the minutes to the nearest 5-minute interval.
 *
 * @param date - The date to adjust.
 * @returns The adjusted date within the available time frames.
 */
function adjustDateToTimeFrame(date: Date): Date {

    // check if the date is within the available time frames
    const validTimeFrame = timeFrames.find(tf => date >= tf.start && date <= tf.end);
    if (validTimeFrame) {

        // // Check if the date is more than 5 minutes in the future
        // const now = new Date();
        // if (date.getTime() - now.getTime() > 5 * 60 * 1000) {
        //     return date;
        // }

        // Round the minutes to the next 5-minute interval
        const roundedMinutes = Math.ceil(date.getMinutes() / 5) * 5;
        date.setMinutes(roundedMinutes);

        // Adjust the hour if necessary
        if (date.getMinutes() === 60) {
            date.setMinutes(0);
            // date.setHours(date.getHours() + 1);
        }
        
        // console.log("adjustDateToTimeFrame", date);
        return date;

        // // Round the minutes to the next 5-minute interval. if already rounded, step to next 5 minutes.
        // if (date.getMinutes() % 5 !== 0) {
        //     const roundedMinutes = Math.ceil(date.getMinutes() / 5) * 5;
        //     date.setMinutes(roundedMinutes);
        // }
        // else {
        //     date.setMinutes(date.getMinutes() + 5);
        // }

        // // update the hours if the new date is in the past
        // const now = new Date();
        // if ( now.getTime() >= date.getTime() ) {
        //     date.setHours(now.getHours());
        // }


        // return date;

    }

    // if not, the date could be before the first available time frame, return the start of the first time frame
    const nextAvailableDay = timeFrames.find(tf => date < tf.start);
    if (nextAvailableDay) return nextAvailableDay.start;

    // there is no next available day, return the end of the last time frame
    return timeFrames[timeFrames.length - 1].end;
}


// ========== relevant code for time restriction ==========






/**
 * Custom hook to determine the initial date and corresponding day index
 * based on the current time and a predefined set of time frames.
 *
 * @param forceLastMinute - A boolean flag indicating whether to force the selection
 * of the last available minute in the time frames.
 * @param setForceLastMinute - A React state setter function to update the `forceLastMinute` flag.
 * 
 * @returns An object containing:
 * - `initialDate`: The calculated initial date based on the current time and time frames.
 * - `initialDayIndex`: The index of the time frame corresponding to the `initialDate`.
 */
export function TimePickerInitialDate() {
    const now = new Date();
    const initialDate = adjustDateToTimeFrame(now);
    const initialDayIndex = timeFrames.findIndex(tf => tf.start.getDate() === initialDate.getDate());
    return { initialDate, initialDayIndex };
}


function TimePicker({selectedDate, setSelectedDate, initialDayIndex = 0}: {selectedDate: Date, setSelectedDate: (date: Date) => void, initialDayIndex: number}) {
    const [forceLastMinute, setForceLastMinute] = useState<boolean>(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(initialDayIndex);

    const currentTimeFrame = timeFrames[selectedDayIndex];


    const adjustedNow = adjustDateToTimeFrame(new Date());

    const minHour = currentTimeFrame.start.getHours();
    const maxHour = currentTimeFrame.end.getHours();

    const minMinute = selectedDate.toDateString() === adjustedNow.toDateString() && selectedDate.getHours() === adjustedNow.getHours()
        ? adjustedNow.getMinutes()
        : 0;

    
    const selectDate = (date: Date) => {

        console.log("currentSelectedDate", selectedDate);
        console.log("selectDate", date);
        

        // if the currently selected hour is the last and the new selected minute is > 0 the step one hour back
        if (selectedDate.getHours() === currentTimeFrame.end.getHours() && date.getMinutes() > 0) {
            date.setHours(date.getHours() - 1);
            console.log("changed hour");
        }

        // if the selected hour is the last available hour, force the selection of the last available minute
        if (date.getHours() === currentTimeFrame.end.getHours()) {
            setForceLastMinute(true);
            date.setMinutes(0);
        } else {
            setForceLastMinute(false);
        }

        console.log("selectDate", date);


        const adjustedDate = adjustDateToTimeFrame(date);
        setSelectedDate(adjustedDate);

        const newDayIndex = timeFrames.findIndex(tf =>
            tf.start.getDate() === adjustedDate.getDate() &&
            tf.start.getMonth() === adjustedDate.getMonth() &&
            tf.start.getFullYear() === adjustedDate.getFullYear()
        );

        if (newDayIndex !== -1) {
            setSelectedDayIndex(newDayIndex);
        }
    };

    const onChange = (date: Date) => {
        selectDate(date);
    };

    return (
        <div className="time-picker p-4">
            {/* {selectedDate.toISOString()} */}
            <div className="time-picker-container">
                <input
                    className="time-picker-input"
                    value={selectedDate.toISOString()}
                    hidden
                    type="text"
                    name="time"
                    readOnly
                    required
                />
                <div className="time-picker-wheels">
                    <DayWheel
                        timeFrames={timeFrames}
                        selectedIndex={selectedDayIndex}
                        onChange={(newDayIndex: number) => {
                            setSelectedDayIndex(newDayIndex);
                            const newDate = new Date(selectedDate);
                            const newDay = timeFrames[newDayIndex].start;
                            newDate.setFullYear(newDay.getFullYear(), newDay.getMonth(), newDay.getDate());
                            setSelectedDate(adjustDateToTimeFrame(newDate));
                        }}
                        classNames="day-wheel mr-4"
                    />
                    <HourWheel
                        date={selectedDate}
                        onChange={onChange}
                        minValue={minHour}
                        maxValue={maxHour}
                        classNames="hour-wheel"
                    />
                    <div className="m-auto font-bold z-3">:</div>
                    <MinuteWheel
                        date={selectedDate}
                        onChange={onChange}
                        minValue={minMinute}
                        classNames="minute-wheel"
                        forceLastItem={forceLastMinute}
                    />
                </div>
                <div className="time-picker-selected-overlay absolute top-1/2 -translate-y-1/2" />
            </div>
        </div>
    );
}

export default TimePicker;
