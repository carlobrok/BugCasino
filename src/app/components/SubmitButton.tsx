
export default function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className={'w-full mt-2 text-white font-bold py-2 px-4 rounded' + (pending ? ' bg-gray-400' : ' bg-blue-500 hover:bg-blue-700')}
        >
            Submit
        </button>
    );

}