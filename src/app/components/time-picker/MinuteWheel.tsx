import React from 'react';
import WheelBase from './WheelBase';

interface MinuteWheelProps {
  /** The currently selected date */
  date: Date;
  /** Called with the updated Date when the minute changes */
  onChange: (date: Date) => void;
}

const MinuteWheel: React.FC<MinuteWheelProps> = ({ date, onChange }) => {
  // Create an array [0, 1, 2, …, 59]
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Update the minute of the current date and return a new Date object.
  const updateDate = (current: Date, newMinute: number): Date => {
    const newDate = new Date(current);
    newDate.setMinutes(newMinute);
    return newDate;
  };

  return (
    <WheelBase
      date={date}
      onChange={onChange}
      items={minutes}
      updateDate={updateDate}
      displayFormatter={(value : number) => value.toString().padStart(2, '0')}
    />
  );
};

export default MinuteWheel;
