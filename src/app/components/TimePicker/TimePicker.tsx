// src/components/TimePicker.tsx
import React, { useState } from 'react';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';
import DayWheel from './DayWheel';

interface dayTimeWindow {
    start: Date;
    end: Date;
}

// Generiert Zeitfenster: Heute bis zu 3 Tage in der Zukunft, jeweils von 09:00 bis 17:00.
const generateTimeFrames = (): dayTimeWindow[] => {
    let timeFrames: dayTimeWindow[] = [];
    const now = new Date();

    if (now.getHours() >= 17) {
        now.setDate(now.getDate() + 1);
    }

    for (let i = 0; i <= 3; i++) {
        const start = new Date(now);
        const end = new Date(now);
        end.setHours(17, 0, 0, 0);
        timeFrames.push({ start, end });
        start.setHours(9, 0, 0, 0);
        now.setDate(now.getDate() + 1);

    }
    return timeFrames;
};

// const timeFrames: dayTimeWindow[] = generateTimeFrames();

const timeFrames: dayTimeWindow[] = [
    {
        start: new Date('2025-02-07T09:00:00'),
        end: new Date('2025-02-07T17:00:00'),
    },
    {
        start: new Date('2025-02-08T08:00:00'),
        end: new Date('2025-02-08T17:00:00'),
    },
    {
        start: new Date('2025-02-09T10:00:00'),
        end: new Date('2025-02-09T19:00:00'),
    },
    {
        start: new Date('2025-02-10T09:00:00'),
        end: new Date('2025-02-10T15:00:00'),
    }
]

function TimePicker() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

    function selectDate(date: Date) {
        setSelectedDate(date);

        const newDayIndex = timeFrames.findIndex(tf =>
            tf.start.getDate() === date.getDate() &&
            tf.start.getMonth() === date.getMonth() &&
            tf.start.getFullYear() === date.getFullYear()
        );
        if (newDayIndex !== -1) {
            setSelectedDayIndex(newDayIndex);
        }
    }


    // Ermittele das aktuell gültige Zeitfenster
    const currentTimeFrame = timeFrames[selectedDayIndex];
    const minHour = currentTimeFrame.start.getHours();
    const maxHour = currentTimeFrame.end.getHours();

    // Passt das Datum ggf. an, falls der Stundenwert außerhalb des gültigen Bereichs liegt.
    const adjustDateToTimeFrame = (date: Date): Date => {
        const newDate = new Date(date);
        const currentHour = newDate.getHours();

        if (currentHour < minHour) {
            newDate.setHours(minHour);
        } else if (currentHour > maxHour) {
            newDate.setHours(maxHour);
        }
        return newDate;
    };

    function onChange(value: Date) {
        const adjustedDate = adjustDateToTimeFrame(value);
        // inputValue = adjustedDate.toDateString();
        // console.log(adjustedDate);
        selectDate(adjustedDate);
    }

    if (selectedDate < currentTimeFrame.start) {
        selectDate(currentTimeFrame.start);
    }

    return (
        <div className="time-picker m-auto p-4">
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

                            // console.log(newDate);

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
                    <div className="m-auto font-bold z-10">:</div>
                    <MinuteWheel
                        date={selectedDate}
                        onChange={onChange}
                        classNames="minute-wheel"
                    />
                </div>
                <div
                    className="time-picker-selected-overlay absolute top-1/2 -translate-y-1/2" 
                />
            </div>
        </div>
    );
}

export default TimePicker;
