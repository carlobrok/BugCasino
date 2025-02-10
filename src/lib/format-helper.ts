export function formatDoneInTime(doneInTime: boolean) {
    return doneInTime ? "timely" : "delayed";
}

export function formatBetCounter(betCount: number) {
    return betCount === 1 ? "1 Bet" : `${betCount} Bets`;
}

export function formatTimeEstimate(estimate: Date) {
    return estimate.toLocaleString("en-UK", {
        weekday: "short",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
      })
}