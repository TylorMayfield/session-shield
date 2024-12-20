/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";
import { PlayIcon, PauseIcon, XMarkIcon } from "@heroicons/react/24/solid";

const DEFAULT_TITLE = "Unknown Tab";
const TITLE_MAX_LENGTH = 12;

function TimerRow({ tabId, timer, onRefresh, totalTime = 0 }) {
  // Validate props
  if (!timer || typeof tabId === "undefined") {
    console.warn("TimerRow: Missing required props");
    return null;
  }

  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isPaused, setIsPaused] = useState(timer.isPaused);
  const [hasImageError, setHasImageError] = useState(false);

  // Reset timer when totalTime changes
  useEffect(() => {
    setTimeLeft(totalTime);
  }, [totalTime]);

  // Format title with ellipsis if too long
  const formatTitle = useCallback((title) => {
    const cleanTitle = title?.trim() || DEFAULT_TITLE;
    return cleanTitle.length > TITLE_MAX_LENGTH
      ? `${cleanTitle.substring(0, TITLE_MAX_LENGTH)}...`
      : cleanTitle;
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) return totalTime;
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPaused, totalTime]);

  // Handle timer actions
  const handleAction = useCallback(
    async (action) => {
      try {
        if (action === "pause" || action === "resume") {
          setIsPaused(action === "pause");
        }

        await chrome.runtime.sendMessage({
          action,
          tabId: parseInt(tabId, 10),
        });

        onRefresh?.();
      } catch (error) {
        console.error("Error handling timer action:", error);
      }
    },
    [tabId, onRefresh]
  );

  const formattedTitle = formatTitle(timer.title);

  return (
    <tr className="border-t hover:bg-gray-50 transition-colors duration-150">
      <td className="py-2 px-2">
        <div className="flex items-center space-x-2">
          {!hasImageError && timer.favIconUrl && (
            <img
              src={timer.favIconUrl}
              alt=""
              className="w-4 h-4 object-contain"
              onError={() => setHasImageError(true)}
            />
          )}
          <span className="truncate max-w-[150px]" title={timer.title}>
            {formattedTitle}
          </span>
        </div>
      </td>
      <td className="py-2 px-2 text-center font-medium">{totalTime}s</td>
      <td className="py-2 px-2 text-center">
        <span
          className={`px-2 py-1 rounded text-sm ${
            isPaused
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {isPaused ? "Paused" : "Active"}
        </span>
      </td>
      <td className="py-2 px-2">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleAction(isPaused ? "resume" : "pause")}
            className={`p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${
              isPaused ? "green" : "yellow"
            }-500 transition-colors`}
            title={isPaused ? "Resume Timer" : "Pause Timer"}
          >
            {isPaused ? (
              <PlayIcon className="h-5 w-5 text-green-600" />
            ) : (
              <PauseIcon className="h-5 w-5 text-yellow-600" />
            )}
          </button>
          <button
            onClick={() => handleAction("removeTimer")}
            className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            title="Remove Timer"
          >
            <XMarkIcon className="h-5 w-5 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default React.memo(TimerRow);
