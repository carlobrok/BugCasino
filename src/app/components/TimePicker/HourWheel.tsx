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

    console.log("HourWheel updateDate", newDate);

    const now = new Date();
    if (
      newDate.getFullYear() === now.getFullYear() &&
      newDate.getMonth() === now.getMonth() &&
      newDate.getDate() === now.getDate() &&
      newDate.getHours() === now.getHours() &&
      newDate.getMinutes() < now.getMinutes()
    ) {
      const roundedMinutes = Math.ceil(now.getMinutes() / 5) * 5;
      newDate.setMinutes(roundedMinutes);
    }

    return newDate;
  };

  const isItemDisabled = (hour: number): boolean => {
    const now = new Date();
    return now.getHours() > hour && now.getTime() >= date.getTime();
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
      isItemDisabled={isItemDisabled}
    />
  );
};

export default HourWheel;
