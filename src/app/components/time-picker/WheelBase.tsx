import React, {
    useRef,
    useEffect,
    useCallback,
    useState,
    MouseEvent,
    TouchEvent,
    WheelEvent,
  } from 'react';
  import './time-picker.css';
  
  export interface WheelBaseProps {
    /** Das aktuell ausgewählte Datum. */
    date: Date;
    /** Callback, der das aktualisierte Datum zurückgibt. */
    onChange: (date: Date) => void;
    /** Die anzuzeigenden Werte (z. B. Stunden, Minuten oder Indizes für Tage). */
    items: number[];
    /**
     * Funktion, die aus dem aktuellen Datum und einem neuen Wert ein aktualisiertes Datum erzeugt.
     */
    updateDate: (current: Date, newValue: number) => Date;
    /** (Optional) Funktion zur Formatierung des anzuzeigenden Wertes. */
    displayFormatter?: (value: number) => string;
    /** (Optional) Untere Grenze (muss in items vorhanden sein). */
    minValue?: number;
    /** (Optional) Obere Grenze (muss in items vorhanden sein). */
    maxValue?: number;

    // Optional: CSS-Klassen, die hinzugefügt werden sollen
    classNames?: string;
  }
  
  /** Höhe in Pixeln jedes sichtbaren Listenelements */
  const ITEM_HEIGHT = 40;
  /** Anzahl sichtbarer Zellen – muss ungerade sein, damit eine Zelle zentriert ist */
  const VISIBLE_CELLS = 5;
  /** Index der mittleren Zelle (0-basiert) */
  const CENTER_INDEX = Math.floor(VISIBLE_CELLS / 2);
  
  const WheelBase: React.FC<WheelBaseProps> = ({
    date,
    onChange,
    items,
    updateDate,
    displayFormatter = (v) => v.toString(),
    minValue,
    maxValue,
    classNames = '',
  }) => {
    // Ermittle den zulässigen Bereich anhand der übergebenen minValue/maxValue.
    const minIndex =
      minValue !== undefined && items.includes(minValue)
        ? items.indexOf(minValue)
        : 0;
    const maxIndex =
      maxValue !== undefined && items.includes(maxValue)
        ? items.indexOf(maxValue)
        : items.length - 1;
  
    // Bei Auswahl eines Elements (Index i) wird translate = (CENTER_INDEX - i)*ITEM_HEIGHT.
    const maxTranslate = (CENTER_INDEX - minIndex) * ITEM_HEIGHT;
    const minTranslate = (CENTER_INDEX - maxIndex) * ITEM_HEIGHT;
  
    const mainListRef = useRef<HTMLDivElement>(null);
  
    // Initial ermitteln wir den aktuell ausgewählten Wert aus dem Datum.
    let currentValue: number;
    if (items.length === 24) {
      currentValue = date.getHours();
    } else if (items.length === 60) {
      currentValue = date.getMinutes();
    } else {
      currentValue = items[0];
    }
    const initialIndex = items.indexOf(currentValue) !== -1 ? items.indexOf(currentValue) : 0;
    const initialTranslate = (CENTER_INDEX - initialIndex) * ITEM_HEIGHT;
  
    const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
    const [currentTranslatedValue, setCurrentTranslatedValue] = useState<number>(initialTranslate);
    const [wasDragged, setWasDragged] = useState<boolean>(false);
  
    // Drag‑bezogene States
    const [startCapture, setStartCapture] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [firstCursorPosition, setFirstCursorPosition] = useState<number>(0);
    const [dragStartTime, setDragStartTime] = useState<number>(0);
    const [dragType, setDragType] = useState<'fast' | 'slow' | null>(null);
    const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null);
    const [showFinalTranslate, setShowFinalTranslate] = useState<boolean>(false);
  
    // Aktualisiere den Transformwert – während des Draggings mit Preview, sonst final.
    useEffect(() => {
      if (mainListRef.current) {
        if (startCapture) {
          mainListRef.current.style.transform = `translateY(${currentTranslatedValue + cursorPosition}px)`;
        } else {
          mainListRef.current.style.transform = `translateY(${currentTranslatedValue}px)`;
        }
      }
    }, [cursorPosition, startCapture, currentTranslatedValue]);
  
    // --- Mouse- und Touch-Eventhandler ---
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      setWasDragged(false);
      setShowFinalTranslate(false);
      setFirstCursorPosition(e.clientY);
      setStartCapture(true);
      setDragStartTime(performance.now());
    };
  
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      setWasDragged(false);
      setShowFinalTranslate(false);
      setFirstCursorPosition(e.targetTouches[0].clientY);
      setStartCapture(true);
      setDragStartTime(performance.now());
    };
  
    const finalizeDrag = useCallback(() => {
      const endTime = performance.now();
      const dragTime = endTime - dragStartTime;
      const computedDragType: 'fast' | 'slow' = dragTime <= 100 ? 'fast' : 'slow';
      setDragType(computedDragType);
      const computedDragDirection: 'down' | 'up' = cursorPosition < 0 ? 'down' : 'up';
      setDragDirection(computedDragDirection);
  
      let extraOffset = 0;
      if (computedDragType === 'fast' && cursorPosition !== 0) {
        extraOffset =
          computedDragDirection === 'down'
            ? - (120 / dragTime) * 100
            : (120 / dragTime) * 100;
      }
      const rawValue = currentTranslatedValue + cursorPosition + extraOffset;
      let finalValue = Math.round(rawValue / ITEM_HEIGHT) * ITEM_HEIGHT;
      if (finalValue > maxTranslate) finalValue = maxTranslate;
      if (finalValue < minTranslate) finalValue = minTranslate;
  
      setCurrentTranslatedValue(finalValue);
      const newSelectedIndex = CENTER_INDEX - finalValue / ITEM_HEIGHT;
      setSelectedIndex(newSelectedIndex);
      onChange(updateDate(date, items[newSelectedIndex]));
      setCursorPosition(0);
      setStartCapture(false);
      setShowFinalTranslate(true);
    }, [
      cursorPosition,
      currentTranslatedValue,
      date,
      dragStartTime,
      items,
      maxTranslate,
      minTranslate,
      onChange,
      updateDate,
    ]);
  
    const handleMouseTouchEnd = (
      e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
    ) => {
      if (startCapture) {
        finalizeDrag();
      }
    };
  
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (startCapture) {
        const movement = e.clientY - firstCursorPosition;
        if (Math.abs(movement) > 5) {
          setWasDragged(true);
        }
        setCursorPosition(movement);
      }
    };
  
    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
      if (startCapture) {
        const movement = e.targetTouches[0].clientY - firstCursorPosition;
        if (Math.abs(movement) > 5) {
          setWasDragged(true);
        }
        setCursorPosition(movement);
      }
    };
  
    const handleWheelScroll = (e: WheelEvent<HTMLDivElement>) => {
      let newTranslate = currentTranslatedValue;
      if (e.deltaY > 0) {
        newTranslate -= ITEM_HEIGHT;
      } else {
        newTranslate += ITEM_HEIGHT;
      }
      if (newTranslate > maxTranslate) newTranslate = maxTranslate;
      if (newTranslate < minTranslate) newTranslate = minTranslate;
      setCurrentTranslatedValue(newTranslate);
      const newIndex = CENTER_INDEX - newTranslate / ITEM_HEIGHT;
      setSelectedIndex(newIndex);
      onChange(updateDate(date, items[newIndex]));
    };
  
    const handleTransitionEnd = () => {
      setShowFinalTranslate(false);
    };
  
    const handleClickToSelect = (idx: number, item: number) => {
      if (wasDragged) {
        return;
      }
      const translate = (CENTER_INDEX - idx) * ITEM_HEIGHT;
      setCurrentTranslatedValue(translate);
      setSelectedIndex(idx);
      onChange(updateDate(date, item));
    };
  
    return (
      <div
        className={`time-picker-wheel ${classNames}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseTouchEnd}
        style={{ height: ITEM_HEIGHT * VISIBLE_CELLS }}
        onWheel={handleWheelScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseTouchEnd}
      >
        <div
          ref={mainListRef}
          className={`
            ${showFinalTranslate && dragType === 'fast' ? 'time-picker-fast' : ''}
            ${showFinalTranslate && dragType === 'slow' ? 'time-picker-slow' : ''}
          `}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateY(${currentTranslatedValue}px)`,
            transition: showFinalTranslate ? 'transform 0.3s ease-out' : 'none',
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="time-picker-cell" style={{ height: ITEM_HEIGHT }}>
              <div
                className={`time-picker-cell-inner ${classNames} ${
                  idx === selectedIndex ? 'time-picker-cell-inner-selected' : ''
                }`}
                onClick={() => handleClickToSelect(idx, item)}
              >
                {displayFormatter(item)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WheelBase;
  