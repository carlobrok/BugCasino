import Amount, { AmountColor } from "./Amount";

interface ModifierButtonProps {
    adjustment: () => void;
    disabled: boolean;
    direction: "increase" | "decrease";
}

function ModifierButton({ adjustment, disabled, direction }: ModifierButtonProps) {
    return (
        <button
            onClick={adjustment}
            disabled={disabled}
            className="px-2 font-bold text-lg rounded-lg shadow-md bg-zinc-500 disabled:bg-zinc-600 hover:bg-zinc-400 hover:text-white disabled:text-gray-400"
            style={{fontFamily: "monospace"}}
        >
            {direction === "increase" ? "+" : "-"}
        </button>
    );
}


export default function InputGroup({ userScore, amount, setAmount, disableInput = false } : { userScore: number, amount: number, setAmount: (amount: number) => void, disableInput?: boolean }) {

    const decrease = () => setAmount(Math.max(0, amount - 1));
    const increase = () => setAmount(Math.min(userScore, amount + 1));

    return (
        <div className="flex items-center align-middle w-fit">
            <ModifierButton adjustment={decrease} disabled={amount <= 0 || disableInput} direction="decrease" />
            <Amount amount={amount} color={AmountColor.Emerald} />
            <ModifierButton adjustment={increase} disabled={amount >= userScore || disableInput} direction="increase" />

        </div>
    );
}