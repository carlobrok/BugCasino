import React from 'react';
import WheelBase, { WheelType } from './WheelBase';

export interface DayWheelProps {
  timeFrames: { start: Date; end: Date }[];
  selectedIndex: number;
  onChange: (newIndex: number) => void;
  classNames?: string;
}

const DayWheel: React.FC<DayWheelProps> = ({ timeFrames, selectedIndex, onChange, classNames }) => {
  const days = timeFrames.map((_, idx) => idx);
  const formatDay = (idx: number): string => {
    const date = timeFrames[idx].start;
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  const updateDate = (current: Date, newIdx: number): Date => {
    const newDate = new Date(current);
    const newDay = timeFrames[newIdx].start;
    newDate.setFullYear(newDay.getFullYear(), newDay.getMonth(), newDay.getDate());

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

  // Prüft, ob das Datum in der Vergangenheit liegt
  const isItemDisabled = (dayIndex: number): boolean => {
    const now = new Date();
    const dayDate = timeFrames[dayIndex].end;
    return dayDate < now;
  };


  return (
    <WheelBase
      date={timeFrames[selectedIndex].start}
      initialIndex={selectedIndex}
      onChange={(newDate: Date) => {
        const newIdx = timeFrames.findIndex(tf =>
          tf.start.getDate() === newDate.getDate() &&
          tf.start.getMonth() === newDate.getMonth() &&
          tf.start.getFullYear() === newDate.getFullYear()
        );
        if (newIdx !== -1) {
          onChange(newIdx);
        }
      }}
      items={days}
      updateDate={updateDate}
      wheelType={WheelType.DAY}
      displayFormatter={(value: number) => formatDay(value)}
      classNames={classNames}
      isItemDisabled={isItemDisabled}
    />
  );
};

export default DayWheel;
