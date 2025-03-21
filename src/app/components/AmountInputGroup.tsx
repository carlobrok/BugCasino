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
            className="px-2 font-bold text-lg rounded-lg shadow-md bg-zinc-500 disabled:bg-zinc-600 hover:bg-zinc-400 hover:text-white disabled:text-gray-400 enabled:hover:cursor-pointer"
            style={{fontFamily: "monospace"}}
        >
            {direction === "increase" ? "+" : "-"}
        </button>
    );
}


export default function InputGroup({ userScore, amount, setAmount, disableInput = false } : { userScore: number, amount: number, setAmount: (amount: number) => void, disableInput?: boolean }) {

    function stepDown(amount: number) {
        return amount <= 10 ? 1 : amount <= 50 ? 5 : amount <= 100 ? 10 : amount <= 1000 ? 100 : 1000
    }

    function stepUp(amount: number) {
        return amount < 10 ? 1 : amount < 50 ? 5 : amount < 100 ? 10 : amount < 1000 ? 100 : 1000;
    } 

    const decrease = () => {
        setAmount(Math.max(0, amount - stepDown(amount)));
    }
    
    const increase = () => {
        setAmount(Math.min(userScore, amount + stepUp(amount)));
    }

    return (
        <div className="flex items-center align-middle w-fit gap-x-2">
            <ModifierButton adjustment={decrease} disabled={amount <= 0 || disableInput} direction="decrease" />
            <Amount amount={amount} color={AmountColor.Emerald} margin={true}/>
            <ModifierButton adjustment={increase} disabled={amount >= userScore || amount + stepUp(amount) > userScore || disableInput} direction="increase" />
        </div>
    );
}