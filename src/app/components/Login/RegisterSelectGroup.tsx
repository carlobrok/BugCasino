// RegisterSelectGroup.tsx
"use client";

import { useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface Group {
  name: string;
  id: number;
}

interface RegisterSelectGroupProps {
  groups: Group[];
}

export default function RegisterSelectGroup({ groups }: RegisterSelectGroupProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const selectGroup = (group: Group | null) => {
    // If the same group is selected, do nothing.
    if (group && selectedGroup && group.id === selectedGroup.id) return;
    setSelectedGroup(group);
  };

  return (
    <div className="w-full mt-2">
      <label htmlFor="group" className="block px-2 font-bold text-sm">
        Group
      </label>
      <Menu as="div" className="relative inline-block text-left w-full">
        <MenuButton
          className="inline-flex w-full justify-between text-md items-center border bg-white gap-x-1.5 rounded-lg px-4 py-1 shadow-xs hover:bg-zinc-100"
        >
          {selectedGroup ? selectedGroup.name : "Select a group"}
          <span>
            {/* You can show either the ChevronDownIcon or ChevronUpIcon as desired */}
            <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
          </span>
        </MenuButton>
        <MenuItems
          className="absolute right-0 z-10 mt-2 w-full  origin-top-right border rounded-lg overflow-hidden bg-white hover:bg-zinc-100 shadow-lg focus:outline-none"
        >
          <div className="py-1">
            {groups.map((group) => (
              <MenuItem key={group.id}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => selectGroup(group)}
                    className={`block w-full text-left px-4 py-1 text-md ${active ? "bg-zinc-200" : ""}`}
                  >
                    {group.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      {/* Hidden input field to store the selected group ID */}
      <input type="hidden" name="group" value={selectedGroup ? selectedGroup.id : ""} />
    </div>
  );
}
