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
        <BaseDropdownItem key={"all"} onClick={() => selectGroup("")}>
          All Groups
        </BaseDropdownItem>
        {groups.map((group) => (
          <BaseDropdownItem key={group} onClick={() => selectGroup(group)}>
            {group}
          </BaseDropdownItem>
        ))}
      </div>
    </BaseDropdown>
  );
}
