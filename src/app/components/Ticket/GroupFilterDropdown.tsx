"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";


interface GroupFilterDropdownProps {
  groups: string[];
}

export default function GroupFilterDropdown({ groups }: GroupFilterDropdownProps) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState("");

  const selectGroup = (group: string) => {
    if (group === selectedGroup) return;

    const params = new URLSearchParams(window.location.search);
    if (group === "") {
      params.delete("groupName");
      setSelectedGroup("");
    } else {
      params.set("groupName", group);
      setSelectedGroup(group);
    }
    
    router.push(`?${params.toString()}`);
  }


  return (
    <Menu as="div" className="relative inline-block text-left w-40">
      <div>
        <MenuButton className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-600" data-open>
          {selectedGroup || 'All Groups'}
          <span>
      
          <ChevronDownIcon aria-hidden="true" className="size-5 text-gray-400 data-[open]:hidden" />
          <ChevronUpIcon aria-hidden="true" className="size-5 text-gray-400 hidden data-[open]:block" />
          </span>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-lg overflow-hidden bg-zinc-700 shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => selectGroup("")}
                className={`block w-full text-left px-4 py-2 text-sm text-white ${active ? 'bg-zinc-600' : ''}`}
              >
                All Groups
              </button>
            )}
          </MenuItem>
          {groups.map((group) => (
            <MenuItem key={group}>
              {({ active }) => (
                <button
                  onClick={() => selectGroup(group)}
                  className={`block w-full text-left px-4 py-2 text-sm text-white ${active ? 'bg-zinc-600' : ''}`}
                >
                  {group}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
