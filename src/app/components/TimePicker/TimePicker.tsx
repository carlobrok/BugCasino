"use client";

import React, { useState } from 'react';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';
import DayWheel from './DayWheel';

interface DayTimeWindow {
    start: Date;
    end: Date;
}

const dateConfig = [
    { date: "2025-03-14", start: "09:00", end: "12:00" },
    { date: "2025-03-15", start: "10:00", end: "17:00" },
    { date: "2025-03-16", start: "11:00", end: "17:00" },
];

const parseDateConfig = (config: { date: string; start: string; end: string }[]): DayTimeWindow[] => {
    return config.map(({ date, start, end }) => ({
        start: new Date(`${date}T${start}:00`),
        end: new Date(`${date}T${end}:00`),
    }));
};

const timeFrames: DayTimeWindow[] = parseDateConfig(dateConfig);



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

        // Check if the date is more than 5 minutes in the future
        const now = new Date();
        if (date.getTime() - now.getTime() > 5 * 60 * 1000) {
            return date;
        }

        // Round the minutes to the next 5-minute interval
        const roundedMinutes = Math.ceil(date.getMinutes() / 5) * 5;
        date.setMinutes(roundedMinutes);

        // Adjust the hour if necessary
        if (date.getMinutes() === 60) {
            date.setMinutes(0);
            date.setHours(date.getHours() + 1);
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
function useInitialDate(forceLastMinute: boolean, setForceLastMinute: React.Dispatch<React.SetStateAction<boolean>>) {
    const now = new Date();
    const initialDate = adjustDateToTimeFrame(now);
    const initialDayIndex = timeFrames.findIndex(tf => tf.start.getDate() === initialDate.getDate());
    return { initialDate, initialDayIndex };
}

function TimePicker() {
    const [forceLastMinute, setForceLastMinute] = useState<boolean>(false);
    const { initialDate, initialDayIndex } = useInitialDate(forceLastMinute, setForceLastMinute);

    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(initialDayIndex);

    const currentTimeFrame = timeFrames[selectedDayIndex];
    

    // Here we calculate the minimum and maximum values for the hour and minute wheels


    const now = new Date();
    const adjustedNow = adjustDateToTimeFrame(now);

    const minHour = selectedDate.toDateString() === adjustedNow.toDateString() && adjustedNow.getHours() > currentTimeFrame.start.getHours()
        ? adjustedNow.getHours()
        : currentTimeFrame.start.getHours();

    const maxHour = currentTimeFrame.end.getHours();

    const minMinute = selectedDate.toDateString() === adjustedNow.toDateString() && selectedDate.getHours() === adjustedNow.getHours()
        ? adjustedNow.getMinutes()
        : 0;


    const selectDate = (date: Date) => {
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
