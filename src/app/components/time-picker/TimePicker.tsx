import React, { useState } from 'react';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';
import DayWheel from './DayWheel';


interface dayTimeWindow {
    start: Date;
    end: Date;
}

// today up to the next 3 days, 9am to 5pm each
// Function to generate timeFrames
const generateTimeFrames = (): dayTimeWindow[] => {
    let timeFrames: dayTimeWindow[] = [];
    const date = new Date();
    for (let i = 0; i <= 3; i++) {
        date.setDate(date.getDate() + i);
        date.setHours(9, 0, 0, 0);
        const start = new Date(date);
        date.setHours(17, 0, 0, 0);
        const end = new Date(date);
        timeFrames.push({ start, end });
    }
    return timeFrames;
};

// Assigning the result of the function to timeFrames
const timeFrames: dayTimeWindow[] = generateTimeFrames();


function TimePicker() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

    // Ermittle gültige Stunden-Min/Max aus dem aktuell ausgewählten TimeFrame:
    const currentTimeFrame = timeFrames[selectedDayIndex];
    const minHour = currentTimeFrame.start.getHours();
    const maxHour = currentTimeFrame.end.getHours();

    // Optional: Bei Änderung des Tages ggf. den Stunden-/Minutenwert anpassen:
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

    let inputValue = selectedDate.toTimeString().slice(0, 5);


    function onChange(value: Date) {
        const adjustedDate = adjustDateToTimeFrame(value);
        inputValue = adjustedDate.toTimeString().slice(0, 5);
        setSelectedDate(adjustedDate);
    }

    return (
        <>
            <input
                className={'time-picker-input hidden'}
                value={inputValue}
                type="text"
                name="time"
                // placeholder={placeHolder}
                readOnly
                required
            />
            <div style={{ display: 'flex', gap: '10px' }}>
                <DayWheel
                    timeFrames={timeFrames}
                    selectedIndex={selectedDayIndex}
                    onChange={(newDayIndex: number) => {
                        setSelectedDayIndex(newDayIndex);
                        // Setze den Tag im ausgewählten Datum neu, behalte HH:MM bei, passe ggf. an
                        const newDate = new Date(selectedDate);
                        const newDay = timeFrames[newDayIndex].start;
                        newDate.setFullYear(newDay.getFullYear(), newDay.getMonth(), newDay.getDate());
                        setSelectedDate(adjustDateToTimeFrame(newDate));
                    }}
                />
                <HourWheel date={selectedDate} onChange={onChange} />
                <MinuteWheel date={selectedDate} onChange={onChange} />
            </div>
        </>
    );
};

export default TimePicker;