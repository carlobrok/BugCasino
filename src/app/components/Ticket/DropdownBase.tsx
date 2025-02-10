"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";

interface BaseDropdownProps {
  /** The label to display on the button (usually the current selection) */
  selectedLabel: string;
  /** The dropdown items (should be one or more MenuItem components) */
  children: React.ReactNode;
  /** Optional extra classes (for example, to set the width) */
  className?: string;
}

// <MenuItem>
//         {({ active }) => (
//             <button
//             onClick={() => handleSelectStatus("all")}
//             className={`block w-full text-left px-4 py-2 text-sm text-white ${
//                 active ? "bg-zinc-500" : ""
//             }`}
//             >
//             All Tickets
//             </button>
//         )}
//         </MenuItem>

export function BaseDropdownItem({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <MenuItem>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`block w-full text-left px-4 py-2 text-sm text-white ${
            active ? "bg-zinc-500" : ""
          }`}
        >
          {children}
        </button>
      )}
    </MenuItem>
  );
}

export default function BaseDropdown({
  selectedLabel,
  children,
  className = "w-40",
}: BaseDropdownProps) {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <MenuButton
          className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-600"
          data-open
        >
          {selectedLabel}
          <span>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-5 text-gray-400 data-[open]:hidden"
            />
            <ChevronUpIcon
              aria-hidden="true"
              className="size-5 text-gray-400 hidden data-[open]:block"
            />
          </span>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-lg overflow-hidden bg-zinc-600 shadow-lg transition focus:solid-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
      >
        {children}
      </MenuItems>
    </Menu>
  );
}
