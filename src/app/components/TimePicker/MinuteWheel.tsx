// src/components/MinuteWheel.tsx
import React from 'react';
import WheelBase from './WheelBase';

interface MinuteWheelProps {
  date: Date;
  onChange: (date: Date) => void;
  minValue?: number;
  maxValue?: number;
  classNames?: string;
  forceLastItem?: boolean;
}

const MinuteWheel: React.FC<MinuteWheelProps> = ({ date, onChange, minValue, maxValue, classNames, forceLastItem }) => {
  const minutes = Array.from({ length: 60 }, (_, i) => i) ;
  
  
  // create an array with steps in round 5 minutes.  
  let allMinutes = [...minutes, 0];
  allMinutes = allMinutes.filter((minute) => minute % 5 === 0);


  const updateDate = (current: Date, newMinute: number): Date => {
    const newDate = new Date(current);
    newDate.setMinutes(newMinute);
    return newDate;
  };

  const isItemDisabled = (minute: number): boolean => {
    const now = new Date();
    const disabled =  now.getMinutes() > minute && now.getHours() >= date.getHours() && now.getDate() >= date.getDate();

    // console.log("MinuteWheel disabled", disabled, "selectedDate", date);
    return disabled;
  }

  return (
    <WheelBase
      date={date}
      onChange={onChange}
      items={allMinutes}
      updateDate={updateDate}
      displayFormatter={(value: number) => value.toString().padStart(2, '0')}
      minValue={minValue}
      maxValue={maxValue}
      classNames={classNames}
      forceLastItem={forceLastItem}
      isItemDisabled={isItemDisabled}
    />
  );
};

export default MinuteWheel;
