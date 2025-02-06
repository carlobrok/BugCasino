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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i <= 3; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    const start = new Date(day);
    start.setHours(9, 0, 0, 0);
    const end = new Date(day);
    end.setHours(17, 0, 0, 0);
    timeFrames.push({ start, end });
  }
  return timeFrames;
};

const timeFrames: dayTimeWindow[] = generateTimeFrames();

function TimePicker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  let inputValue = selectedDate.toTimeString().slice(0, 5);

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
    inputValue = adjustedDate.toTimeString().slice(0, 5);
    setSelectedDate(adjustedDate);
  }

  return (
    <>
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
      />
      <input
        className={'time-picker-input hidden'}
        value={inputValue}
        type="text"
        name="time"
        readOnly
        required
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <HourWheel date={selectedDate} onChange={onChange} minValue={minHour} maxValue={maxHour} />
        <MinuteWheel date={selectedDate} onChange={onChange} />
      </div>
    </>
  );
}

export default TimePicker;
