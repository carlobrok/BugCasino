import React from 'react';
import WheelBase from './WheelBase';

interface MinuteWheelProps {
  /** Das aktuell ausgewählte Datum */
  date: Date;
  /** Callback, wenn sich die Minute ändert */
  onChange: (date: Date) => void;
  /** Optionale untere Grenze für die Minuten */
  minValue?: number;
  /** Optionale obere Grenze für die Minuten */
  maxValue?: number;
}

const MinuteWheel: React.FC<MinuteWheelProps> = ({ date, onChange, minValue, maxValue }) => {
  // Erstelle ein Array [0, 1, 2, …, 59]
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Aktualisiere die Minute des aktuellen Datums und erzeuge ein neues Date-Objekt.
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
      classNames='minute-wheel'
    />
  );
};

export default MinuteWheel;
