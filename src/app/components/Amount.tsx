import { BanknotesIcon } from "@heroicons/react/24/outline";

export default function Amount({ amount, color = false }: { amount: number; color?: boolean }) {
    return (
        <div className="flex items-center mx-2">  
            <p>{amount}</p>
            <BanknotesIcon className={`size-4 ml-1 ${color ? "stroke-amber-400" : "stroke-zinc-300"}`} />
        </div>
    );
}