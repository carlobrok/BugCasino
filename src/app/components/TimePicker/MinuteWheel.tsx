// src/components/MinuteWheel.tsx
import React from 'react';
import WheelBase from './WheelBase';

interface MinuteWheelProps {
  date: Date;
  onChange: (date: Date) => void;
  minValue?: number;
  maxValue?: number;
  classNames?: string;
}

const MinuteWheel: React.FC<MinuteWheelProps> = ({ date, onChange, minValue, maxValue, classNames }) => {
  const minutes = Array.from({ length: 60 }, (_, i) => i);

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
      displayFormatter={(value: number) => value.toString().padStart(2, '0')}
      minValue={minValue}
      maxValue={maxValue}
      classNames={classNames}
    />
  );
};

export default MinuteWheel;
