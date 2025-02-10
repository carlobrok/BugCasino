
function GroupCard() {
    return (
        <div className="relative p-6 rounded-2xl bg-zinc-700 shadow-lg">
            <div className="flex flex-col justify-between h-full">
                <h1>Group Card</h1>
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <h1>Tickets</h1>
                    </div>
                    <div className={"w-1/2"}>
                        <h1>Score</h1>
                    </div>
                </div>
                <div className="flex justify-between">
                    <p>Person 1</p>
                    <p>10</p>
                </div>
                <div className="flex justify-between">
                    <p>Person 2</p>
                    <p>20</p>
                </div>
            </div>


        </div>
    );
}

export default function GroupLeaderBoard() {
    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">Group Leader Board</h1>
                <GroupCard />
            </div>
        </>
    );
}