"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@headlessui/react";
import BaseDropdown, { BaseDropdownItem } from "./DropdownBase";

type Status = "open" | "closed" | "all";

export default function TicketStatusDropdown() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("all");

  const applyStatus = (status: Status) => {
    const params = new URLSearchParams(window.location.search);
    if (status === "open") {
      params.set("open", "true");
    } else if (status === "closed") {
      params.set("open", "false");
    } else {
      params.delete("open");
    }
    router.push(`?${params.toString()}`);
  };

  // Update the URL parameters when the status changes.
  useEffect(() => {
    applyStatus(status);
  }, [status]);

  const handleSelectStatus = (newStatus: Status) => {
    if (newStatus === status) return;
    setStatus(newStatus);
  };

  let statusLabel = "";
  if (status === "open") {
    statusLabel = "Open Tickets";
  } else if (status === "closed") {
    statusLabel = "Closed Tickets";
  } else {
    statusLabel = "All Tickets";
  }

  return (
    <BaseDropdown selectedLabel={statusLabel} className="w-40">
      <div className="py-1">
        <BaseDropdownItem onClick={() => handleSelectStatus("all")}>
          All Tickets
        </BaseDropdownItem>
        <BaseDropdownItem onClick={() => handleSelectStatus("open")}>
          Open Tickets
        </BaseDropdownItem>
        <BaseDropdownItem onClick={() => handleSelectStatus("closed")}>
          Closed Tickets
        </BaseDropdownItem>
      </div>
    </BaseDropdown>
  );
}
