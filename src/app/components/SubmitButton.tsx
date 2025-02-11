
export default function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <div className="flex justify-center">
            <button
                type="submit"
                disabled={pending}
                className={'w-64 mt-4 text-white font-bold py-2 px-4 rounded-lg' + (pending ? ' bg-zinc-700 animate-pulse' : ' bg-blue-500 hover:bg-blue-700')}
            >
                Submit
            </button>
        </div>
    );

}