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

export function formatTimeEstimateShort(estimate: Date) {
    return estimate.toLocaleString("en-UK", {
        day: "numeric",
        month: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
}


export enum RankColors {
    FIRST = "bg-gradient-to-tr from-golddark via-goldlight to-golddark",  // bg-linear-45deg
    SECOND = "bg-gradient-to-tr from-zinc-400 via-zinc-100 to-slate-400",  // bg-linear-45deg
    THIRD = "bg-gradient-to-tr from-bronzedark via-bronzelight to-bronzedark"  // bg-linear-45deg
}

export function getRankColor(rank: number,): string | null {
    return rank === 1 ? RankColors.FIRST : rank === 2 ? RankColors.SECOND : rank === 3 ? RankColors.THIRD : null;
}