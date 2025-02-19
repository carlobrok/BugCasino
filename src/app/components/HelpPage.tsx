"use client";

import React, { useEffect, useState } from "react";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function HelpPage() {
    const [showHelp, setShowHelp] = useState(false);

    const containerRef = React.createRef<HTMLDivElement>();

    const toggleHelp = () => {
        setShowHelp((prev) => !prev);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowHelp(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    return (
        <div className="relative flex items-center justify-center">
            <button onClick={toggleHelp} className="hover:cursor-pointer">
                <QuestionMarkCircleIcon className="size-6 fill-zinc-300" />
            </button>
            {showHelp && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20">
                    <div
                        className={`relative w-[800px] h-[300px] text-white  bg-white/30 backdrop-blur-lg border-2 border-gray-300/30 p-6 rounded-2xl shadow-lg transition-opacity duration-1000 ${showHelp ? 'translate-y-0 opacity-100' : '-translate-y-40 opacity-0'}`}
                    >
                        <button
                            onClick={toggleHelp}
                            className="absolute top-3 right-3 text-zinc-300 hover:text-zinc-100"
                        >
                            <XMarkIcon className="size-8 hover:cursor-pointer" />
                        </button>
                        <h2 className="w-full text-center mb-2">Welcome to the Bug Casino!</h2>
                        <div className="italic mx-4 text-sm font-normal">

                            <p>
                                Did you know that many mammals participate in gambling-like games to sharpen their instincts and improve teamwork in high-pressure environments?
                                Didn't you? Neither did I, but I'm confident that ChatGPT made that fact up. Anyway, here's some help to get you started:
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
