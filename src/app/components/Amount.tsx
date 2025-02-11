import { CircleStackIcon } from "@heroicons/react/20/solid";

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

export default function Amount({ amount, color = AmountColor.Emerald, size = 5}: { amount: number | React.ReactElement; color?: AmountColor, size?: number }) {
    return (
        <div className="flex items-center mx-2">  
            {typeof amount === 'number' ? <p>{amount}</p> : amount}
            <CircleStackIcon className={`size-${size} w-${size} ml-1 ${ color } drop-shadow-md`} />
        </div>
    );
}