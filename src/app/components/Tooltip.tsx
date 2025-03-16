'use client';
import React, { useEffect, useRef, useState } from "react";

export const Tooltip = ({ text, children, enabled = true}: { text: string | React.ReactNode, children: React.ReactNode, enabled?: boolean }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState("top"); // Default position is 'top'
    const tooltipRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible || !enabled) return;
        if (!targetRef.current || !tooltipRef.current) return;

        const targetEl = targetRef.current;
        const tooltipEl = tooltipRef.current;
        if (!targetEl || !tooltipEl) return;

        const targetRect = targetEl.getBoundingClientRect();
        const tooltipHeight = tooltipEl.offsetHeight;

        // Check if there's enough space above, otherwise show below
        if (targetRect.top < tooltipHeight + 10) {
            setPosition("bottom");
        } else {
            setPosition("top");
        }
    }, [visible]);

    return (
        <div
        className="relative flex items-center"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        ref={targetRef}
        >
            {children}
            <div
                ref={tooltipRef}
                className={`absolute px-3 py-2 z-10 text-md font-medium left-1/2 transform -translate-x-1/2  not-italic text-white max-w-60 text-sm backdrop-blur-xl bg-zinc-300/20 rounded-xl shadow-xl transition-opacity duration-200 ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"
                    } ${visible && enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ width: 'max-content' }}
            >
                {text}
            </div>
        </div>
    );
};