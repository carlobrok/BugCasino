import { Coins } from "lucide-react";

export enum AmountColor {
    Emerald = "fill-amber-400",
    EmeraldDark = "fill-amber-400 stroke-zinc-700/25",
    Gray = "stroke-zinc-300 stroke-zinc-200/50"
}

// export enum AmountColor {
//     Emerald = "stroke-sky-500",
//     EmeraldDark = "stroke-sky-700",
//     Gray = "stroke-zinc-300"
// }

// export enum AmountColor {
//     Emerald = "stroke-emerald-500",
//     EmeraldDark = "stroke-emerald-700",
//     Gray = "stroke-zinc-300"
// }

export default function Amount({ amount, color = AmountColor.Emerald, size = 20, margin = false}: { amount: number | React.ReactElement; color?: AmountColor, size?: number, margin?: boolean }) {
    return (
        <span className={"inline-flex items-center" + (margin ? " ml-2 mr-2" : "")}>  
            {amount}
            <Coins className={AmountColor.Emerald + " drop-shadow-md ml-1 align-middle inline shrink-0"} color="#fffbeb" size={size} />
        </span>
    );
}