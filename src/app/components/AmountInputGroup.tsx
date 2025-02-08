import Amount from "./Amount";

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
            className="px-2 font-bold text-lg rounded-lg bg-zinc-500 disabled:bg-zinc-600 hover:bg-zinc-400 hover:text-white disabled:text-gray-400"
            style={{fontFamily: "monospace"}}
        >
            {direction === "increase" ? "+" : "-"}
        </button>
    );
}


export default function InputGroup({ userScore, amount, setAmount } : { userScore: number, amount: number, setAmount: (amount: number) => void }) {

    const decrease = () => setAmount(Math.max(0, amount - 1));
    const increase = () => setAmount(Math.min(userScore, amount + 1));



    return (
        <div className="flex items-center align-middle w-fit">
            <ModifierButton adjustment={decrease} disabled={amount <= 0} direction="decrease" />



            
            <Amount amount={amount} color={true} />

            <ModifierButton adjustment={increase} disabled={amount >= userScore} direction="increase" />

        </div>
    );
}