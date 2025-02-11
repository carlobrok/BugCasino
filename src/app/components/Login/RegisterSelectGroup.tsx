// RegisterSelectGroup.tsx
"use client";

import { useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface Group {
  name: string;
  id: number;
}

interface RegisterSelectGroupProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  groups: Group[];
  errors: any;
}

export default function RegisterSelectGroup({ groups, register, setValue, errors }: RegisterSelectGroupProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const selectGroup = (group: Group | null) => {
    if (!group) return;

    setSelectedGroup(group);
    setValue("groupId", group.id, { shouldValidate: true });
  };

  return (
    <div className="w-full">
      <label htmlFor="group" className="block px-2 font-bold text-sm">
        Group
      </label>
      <Menu as="div" className="relative inline-block text-left w-full">
        <MenuButton
          className="inline-flex w-full justify-between text-md items-center border bg-white gap-x-1.5 rounded-lg px-4 py-1 shadow-xs hover:bg-zinc-100"
          data-open
        >
          {selectedGroup ? selectedGroup.name : "Select a group"}
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
        <MenuItems
          className="absolute right-0 z-10 mt-2 w-full  origin-top-right border rounded-lg overflow-hidden bg-white shadow-lg focus:solid-none"
        >
          <div className="py-1">
            {groups.map((group) => (
              <MenuItem key={group.id}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => selectGroup(group)}
                    className={`block w-full text-left px-4 py-1 text-md ${active ? "bg-zinc-100" : ""}`}
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
      <input type="hidden" {...register("groupId", {required: "Group is required"})} />
      {errors.groupId && (
        <p className="text-red-500 text-sm">{errors.groupId.message}</p>
      )}
    </div>
  );
}
