
import React from 'react';
import WheelBase from './WheelBase';

interface HourWheelProps {
  /** The currently selected date */
  date: Date;
  /** Called with the updated Date when the hour changes */
  onChange: (date: Date) => void;
}

const HourWheel: React.FC<HourWheelProps> = ({ date, onChange }) => {
  // Create an array [0, 1, 2, …, 23]
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Update the hour of the current date and return a new Date object.
  const updateDate = (current: Date, newHour: number): Date => {
    const newDate = new Date(current);
    newDate.setHours(newHour);
    return newDate;
  };

  return (
    <WheelBase
      date={date}
      onChange={onChange}
      items={hours}
      updateDate={updateDate}
      displayFormatter={(value : number) => value.toString().padStart(2, '0')}
    />
  );
};

export default HourWheel;
