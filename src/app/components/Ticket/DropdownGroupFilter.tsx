"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@headlessui/react";
import BaseDropdown, { BaseDropdownItem } from "./DropdownBase";

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
  };

  return (
    <BaseDropdown selectedLabel={selectedGroup || "All Groups"} className="w-40">
      <div className="py-1">
        <MenuItem>
          {({ active }) => (
            <button
              onClick={() => selectGroup("")}
              className={`block w-full text-left px-4 py-2 text-sm text-white ${
                active ? "bg-zinc-600" : ""
              }`}
            >
              All Groups
            </button>
          )}
        </MenuItem>
        {groups.map((group) => (
          // <MenuItem key={group}>
          //   {({ active }) => (
          //     <button
          //       onClick={() => selectGroup(group)}
          //       className={`block w-full text-left px-4 py-2 text-sm text-white ${
          //         active ? "bg-zinc-600" : ""
          //       }`}
          //     >
          //       {group}
          //     </button>
          //   )}
          // </MenuItem>
          <BaseDropdownItem key={group} onClick={() => selectGroup(group)}>
            {group}
          </BaseDropdownItem>
        ))}
      </div>
    </BaseDropdown>
  );
}
