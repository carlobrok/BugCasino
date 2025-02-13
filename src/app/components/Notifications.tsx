"use client";

// components/Notifications.tsx
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { BellAlertIcon, BellIcon } from "@heroicons/react/24/solid";
import { BetNotification } from "../api/notifications/route";
import GradientLine from "./GradientLine";

export default function Notifications() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<BetNotification[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showWiggle, setShowWiggle] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      console.log("Notifications: Session not authenticated");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const newNotifications = await res.json();
        setNotifications(newNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Initial fetch and then poll every 10 seconds
    fetchNotifications();
    const pollInterval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(pollInterval);
  }, [status]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0 && !showNotifications) {
      setShowWiggle(true);
      const timeout = setTimeout(() => setShowWiggle(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  return (
    <>
      <div ref={containerRef}  className="relative flex items-center">
        <button
          onClick={toggleNotifications}
        >
          { notifications.length > 0 ? 
            <BellAlertIcon className={"size-6 hover:cursor-pointer fill-red-300" + (showWiggle ? " animate-wiggle" : "")}/> 
            :
            <BellIcon className={"size-6"} />
          }
        </button>

        {showNotifications && (
          <div className="absolute top-10 -right-20 z-10 mt-2 w-80 origin-top-right rounded-lg overflow-hidden bg-zinc-300 shadow-lg">
            <div className="py-1">
              {notifications.map((notification, index) => (
                <div key={notification.bet.id} className="px-4 py-2">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.ticketAuthor}</p>
                  <p>#{notification.ticketId}</p>
                  {(index < notifications.length - 1 && <GradientLine key={index} />)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
