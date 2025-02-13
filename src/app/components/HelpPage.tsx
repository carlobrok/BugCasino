"use client"

import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import React, { use, useEffect, useState } from "react";


export default function HelpPage() {
    const [showHelp, setShowHelp] = useState(false);
    
    const containerRef = React.createRef<HTMLDivElement>();

    const toggleHelp = () => {
        setShowHelp((prev) => !prev);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowHelp(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div ref={containerRef} className="relative flex items-center">
                <button onClick={toggleHelp}>
                    <QuestionMarkCircleIcon className="size-6 fill-zinc-300" />
                </button>
                <div className={"absolute inset-0 bg-zinc-100/30 border border-zinc-300 rounded-lg p-4 shadow-lg" + (showHelp ? "" : " hidden")}>

                </div>
            </div>
        </>
    );
}