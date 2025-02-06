import React from 'react';
import WheelBase from './WheelBase';

interface HourWheelProps {
  /** Das aktuell ausgewählte Datum */
  date: Date;
  /** Callback, wenn sich die Stunde ändert */
  onChange: (date: Date) => void;
  /** Optionale untere Grenze für die Stunden */
  minValue?: number;
  /** Optionale obere Grenze für die Stunden */
  maxValue?: number;
}

const HourWheel: React.FC<HourWheelProps> = ({ date, onChange, minValue, maxValue }) => {
  // Erstelle ein Array [0, 1, 2, …, 23]
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Aktualisiere die Stunde des aktuellen Datums und erzeuge ein neues Date-Objekt.
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
      classNames='hour-wheel'
    />
  );
};

export default HourWheel;
