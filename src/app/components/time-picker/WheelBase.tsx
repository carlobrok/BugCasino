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
    /** The currently selected date. */
    date: Date;
    /** Called with the updated Date when the user selects a new value. */
    onChange: (date: Date) => void;
    /** The list of numbers (hours or minutes) to display. */
    items: number[];
    /**
     * Function that receives the current date and the newly selected number,
     * and returns a new Date with the updated value.
     */
    updateDate: (current: Date, newValue: number) => Date;
    /** (Optional) A function to format the numeric item for display. */
    displayFormatter?: (value: number) => string;
    /** (Optional) The minimum allowed value (must exist in items) */
    minValue?: number;
    /** (Optional) The maximum allowed value (must exist in items) */
    maxValue?: number;
}

/** Height in pixels of each selectable item */
const ITEM_HEIGHT = 40;
/** Number of visible cells; assumed to be odd so that one cell is centered */
const VISIBLE_CELLS = 5;
/** The center cell index (zero-indexed) */
const CENTER_INDEX = Math.floor(VISIBLE_CELLS / 2);

/**
 * WheelBase implements common scroll behavior. It listens to scroll events,
 * calculates the currently selected index, and calls onChange with a new Date.
 */
const WheelBase: React.FC<WheelBaseProps> = ({
    date,
    onChange,
    items,
    updateDate,
    displayFormatter = (v) => v.toString(),
}) => {
    // We keep a "translated" value that represents the Y-offset (in px) of the list.
    // When the wheel is in its default (centered) state for the first item,
    // the translate value will be (CENTER_INDEX * ITEM_HEIGHT).
    const maxTranslate = CENTER_INDEX * ITEM_HEIGHT;
    const minTranslate = (CENTER_INDEX - (items.length - 1)) * ITEM_HEIGHT;

    const mainListRef = useRef<HTMLDivElement>(null);

    // selectedIndex corresponds to items array index (computed from the final translation)
    const [selectedIndex, setSelectedIndex] = useState<number>(() => {
        let currentValue: number;
        if (items.length === 24) {
            currentValue = date.getHours();
        } else if (items.length === 60) {
            currentValue = date.getMinutes();
        } else {
            currentValue = items[0];
        }
        const idx = items.indexOf(currentValue);
        return idx !== -1 ? idx : 0;
    });

    // Initialize currentTranslatedValue from the provided date.
    const initialTranslate = (CENTER_INDEX - selectedIndex) * ITEM_HEIGHT;
    const [currentTranslatedValue, setCurrentTranslatedValue] = useState<number>(initialTranslate);

    // New flag to determine if a drag (rather than a click) occurred.
    const [wasDragged, setWasDragged] = useState<boolean>(false);

    // Drag-related states
    const [startCapture, setStartCapture] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [firstCursorPosition, setFirstCursorPosition] = useState<number>(0);
    const [dragStartTime, setDragStartTime] = useState<number>(0);
    const [dragType, setDragType] = useState<'fast' | 'slow' | null>(null);
    const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null);
    const [showFinalTranslate, setShowFinalTranslate] = useState<boolean>(false);

    // Preview: update the transform as the user drags.
    useEffect(() => {
        if(!mainListRef.current) return;
        if (startCapture) {
            mainListRef.current.style.transform = `translateY(${currentTranslatedValue + cursorPosition}px)`;
        } else {
            mainListRef.current.style.transform = `translateY(${currentTranslatedValue}px)`;
        }
    }, [cursorPosition, startCapture, currentTranslatedValue]);

    // --- Mouse and Touch event handlers ---

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        // Reset the drag flag on new down.
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
            // Add an extra offset based on drag speed; tweak multiplier as desired.
            extraOffset =
            computedDragDirection === 'down'
            ? - (120 / dragTime) * 100
            : (120 / dragTime) * 100;
        }
        // Compute the raw new translate value.
        const rawValue = currentTranslatedValue + cursorPosition + extraOffset;
        // Snap to the nearest multiple of ITEM_HEIGHT.
        let finalValue = Math.round(rawValue / ITEM_HEIGHT) * ITEM_HEIGHT;
        // Clamp within allowed range.
        if (finalValue > maxTranslate) finalValue = maxTranslate;
        if (finalValue < minTranslate) finalValue = minTranslate;
        
        console.log('rawValue', rawValue, 'finalValue', finalValue);

        setCurrentTranslatedValue(finalValue);
        // Compute selected index from final translation.
        const newSelectedIndex = CENTER_INDEX - finalValue / ITEM_HEIGHT;
        setSelectedIndex(newSelectedIndex);
        // Call the onChange callback with the updated Date.
        onChange(updateDate(date, items[newSelectedIndex]));
        // Reset drag preview state.
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

    const handleMouseTouchEnd = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
        if (startCapture) {
            finalizeDrag();
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (startCapture) {
            const movement = e.clientY - firstCursorPosition;
            // If the movement exceeds a threshold (e.g., 5px), mark as dragged.
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

    // Handle wheel scroll to update the translate value and selection.
    const handleWheelScroll = (e: WheelEvent<HTMLDivElement>) => {
        // e.preventDefault();
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

    // After any CSS transition (if used for a smooth snap), we could clear the final-translate flag.
    const handleTransitionEnd = () => {
        setShowFinalTranslate(false);
    };

    // Only handle clicks if a drag did NOT occur.
    const handleClickToSelect = (idx: number, item: number) => {
        if (wasDragged) {
            // If this was part of a drag, ignore the click.
            return;
        }
        const translate = (CENTER_INDEX - idx) * ITEM_HEIGHT;
        setCurrentTranslatedValue(translate);
        setSelectedIndex(idx);
        onChange(updateDate(date, item));
    };

    return (
        <div
            className={'time-picker-hour'}
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
                    <div
                        key={idx}
                        className="time-picker-cell-hour"
                        style={{ height: ITEM_HEIGHT }}
                    >
                        <div
                            className={`time-picker-cell-inner-hour ${idx === selectedIndex ? ' time-picker-cell-inner-selected' : ''}`}
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
