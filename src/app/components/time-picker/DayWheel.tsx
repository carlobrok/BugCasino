// Neue Datei: src/components/DayWheel.tsx
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
  // Erstelle ein Array aus Indizes entsprechend der timeFrames Länge.
  const days = timeFrames.map((_, idx) => idx);
  // Formatierung: z. B. "Do 06.02." etc.
  const formatDay = (idx: number): string => {
    const date = timeFrames[idx].start;
    // Nutzt localeString-Optionen, Du kannst das noch anpassen
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  // Aktualisiere das Datum: Hier wird in WheelBase per updateDate einfach der Tag ersetzt.
  const updateDate = (current: Date, newIdx: number): Date => {
    const newDate = new Date(current);
    // Ersetze Tag, Monat, Jahr mit denen des ausgewählten TimeFrames (Startdatum)
    const newDay = timeFrames[newIdx].start;
    newDate.setFullYear(newDay.getFullYear(), newDay.getMonth(), newDay.getDate());
    return newDate;
  };

  return (
    <WheelBase
      date={timeFrames[selectedIndex].start} // Für die Anzeige wird der Tag aus dem TimeFrame genutzt.
      onChange={(_newDate) => onChange} // Wir ignorieren hier den Date-Wert, da wir nur den Index brauchen.
      items={days}
      updateDate={(current, newIdx) => updateDate(current, newIdx)}
      displayFormatter={(value) => formatDay(value)}
    />
  );
};

export default DayWheel;
