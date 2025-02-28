"use client"

import React, { useState } from "react";

function ExpandableList() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="p-4">
      {/* Toggle button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={toggleList}
      >
        {isOpen ? "Close List" : "Open List"}
      </button>

      {/* Animated container */}
      <div
        className={`
          mt-4
          transition-all 
          duration-500 
          ease-in-out 
          ${isOpen ? "max-h-80" : "max-h-0"}
          overflow-auto
          bg-gray-100 
          rounded 
          shadow
        `}
      >
        {/* List content (placeholder) */}
        <ul>
          {Array.from({ length: 10 }).map((_, i) => (
            <li 
              key={i} 
              className="p-4 border-b border-gray-300 last:border-0"
            >
              Placeholder item {i + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExpandableList;
