// src/components/HourWheel.tsx
import React from 'react';
import WheelBase from './WheelBase';

interface HourWheelProps {
  date: Date;
  onChange: (date: Date) => void;
  minValue?: number;
  maxValue?: number;
  classNames?: string;
}

const HourWheel: React.FC<HourWheelProps> = ({ date, onChange, minValue, maxValue, classNames }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

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
      displayFormatter={(value: number) => value.toString().padStart(2, '0')}
      minValue={minValue}
      maxValue={maxValue}
      classNames={classNames}
    />
  );
};

export default HourWheel;
