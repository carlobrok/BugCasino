import { BanknotesIcon } from "@heroicons/react/24/outline";

export enum AmountColor {
    Emerald = "stroke-emerald-600",
    EmeraldDark = "stroke-emerald-800",
    Violet = "stroke-violet-800",
    Gray = "stroke-zinc-300"
}

export default function Amount({ amount, color = AmountColor.Emerald, size = 5}: { amount: number | React.ReactElement; color?: AmountColor, size?: number }) {
    return (
        <div className="flex items-center mx-2">  
            {typeof amount === 'number' ? <p>{amount}</p> : amount}
            <BanknotesIcon className={`w-${size} h-${size} ml-1 ${ color } drop-shadow-md`} />
        </div>
    );
}