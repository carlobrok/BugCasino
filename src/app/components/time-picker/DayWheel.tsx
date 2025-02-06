import React from 'react';
import WheelBase from './WheelBase';

export interface DayWheelProps {
  /** Array der verfügbaren Zeitfenster */
  timeFrames: { start: Date; end: Date }[];
  /** Der aktuell ausgewählte Tagindex */
  selectedIndex: number;
  /** Callback, der den neuen Tagindex zurückgibt */
  onChange: (newIndex: number) => void;
}

const DayWheel: React.FC<DayWheelProps> = ({ timeFrames, selectedIndex, onChange }) => {
  // Erstelle ein Array aus Indizes entsprechend der Anzahl an TimeFrames.
  const days = timeFrames.map((_, idx) => idx);
  // Formatierung: z. B. "Do 06.02." etc.
  const formatDay = (idx: number): string => {
    const date = timeFrames[idx].start;
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const updateDate = (current: Date, newIdx: number): Date => {
    const newDate = new Date(current);
    const newDay = timeFrames[newIdx].start;
    newDate.setFullYear(newDay.getFullYear(), newDay.getMonth(), newDay.getDate());
    return newDate;
  };

  return (
    <WheelBase
      date={timeFrames[selectedIndex].start}
      onChange={(newDate: Date) => {
        // Ermittle anhand des neuen Datums den Index im timeFrames-Array.
        const newIdx = timeFrames.findIndex((tf) => {
          return (
            tf.start.getDate() === newDate.getDate() &&
            tf.start.getMonth() === newDate.getMonth() &&
            tf.start.getFullYear() === newDate.getFullYear()
          );
        });
        if (newIdx !== -1) {
          onChange(newIdx);
        }
      }}
      items={days}
      updateDate={updateDate}
      displayFormatter={(value: number) => formatDay(value)}
      classNames='day-wheel'
    />
  );
};

export default DayWheel;
