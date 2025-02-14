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
        <div ref={containerRef} className="relative flex items-center justify-center">
            <button onClick={toggleHelp}>
                <QuestionMarkCircleIcon className="size-6 fill-zinc-300" />
            </button>
            {showHelp && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20">
                    <div 
                        className={`relative w-[500px] h-[300px] bg-white/30 backdrop-blur-sm border-2 border-gray-300/30 p-6 rounded-2xl shadow-lg transition-opacity duration-1000 ${showHelp ? 'translate-y-0 opacity-100' : '-translate-y-40 opacity-0'}`}
                    >
                        <button 
                            onClick={toggleHelp} 
                            className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold">Help Modal</h2>
                        <p className="mt-2 text-gray-700">This is your help modal content.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
