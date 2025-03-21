
export interface DayTimeWindow {
    start: Date;
    end: Date;
}

const dateConfig = [
    { date: "2025-03-19", start: "10:00", end: "17:00" },
    { date: "2025-03-20", start: "09:00", end: "17:00" },
    { date: "2025-03-21", start: "09:00", end: "12:00" },
];

const parseDateConfig = (config: { date: string; start: string; end: string }[]): DayTimeWindow[] => {
    return config.map(({ date, start, end }) => ({
        start: new Date(`${date}T${start}:00`),
        end: new Date(`${date}T${end}:00`),
    }));
};

export const timeFrames: DayTimeWindow[] = parseDateConfig(dateConfig);

export function bugCasinoClosed(date: Date) {
    return new Date() > timeFrames[timeFrames.length - 1].end;
}

// returns total minutes laying within the timeFrames 
export function getDurationWithinTimeFrames(start: Date, end: Date) : number {
    let totalDuration = 0;

    for (const timeFrame of timeFrames) {
        // add the whole time frame if it is within the given time frame
        if (start < timeFrame.start && end > timeFrame.end) {
            totalDuration += timeFrame.end.getTime() - timeFrame.start.getTime();
        }

        // add the partial time frame if it is within the given time frame
        else if (start < timeFrame.start && end >= timeFrame.start && end <= timeFrame.end) {
            totalDuration += end.getTime() - timeFrame.start.getTime();
        }
        else if (start >= timeFrame.start && start <= timeFrame.end && end > timeFrame.end) {
            totalDuration += timeFrame.end.getTime() - start.getTime();
        }
        else if (start >= timeFrame.start && end <= timeFrame.end) {
            totalDuration += end.getTime() - start.getTime();
        }
    }

    // conver
    const minutesInTimeFrames = Math.floor(totalDuration / 60000);
    return minutesInTimeFrames;
}

