import React from "react";
import { PlayIcon, PauseIcon, XMarkIcon } from "@heroicons/react/24/solid";

function TimerRow({ tabId, timer, onRefresh, totalTime }) {
  const [timeLeft, setTimeLeft] = React.useState(totalTime); // Initialize with totalTime
  const [isPaused, setIsPaused] = React.useState(timer.isPaused); // Track the pause state

  // Reset timeLeft when totalTime changes
  React.useEffect(() => {
    setTimeLeft(totalTime);
  }, [totalTime]);

  // Timer update logic when not paused
  React.useEffect(() => {
    if (isPaused) return; // Don't start the interval if paused

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        // Reset to totalTime when the timer reaches 0
        if (prevTimeLeft <= 0) {
          return totalTime;
        }
        return prevTimeLeft - 1; // Decrease by 1 every second
      });
    }, 1000);

    // Cleanup on component unmount or if paused
    return () => clearInterval(intervalId);
  }, [isPaused, totalTime]);

  // Action handler for pause/resume
  const handleAction = async (action) => {
    if (action === "pause") {
      setIsPaused(true);
    } else if (action === "resume") {
      setIsPaused(false);
    }

    // Send the action to the background or extension service
    await chrome.runtime.sendMessage({
      action,
      tabId: parseInt(tabId),
    });
    onRefresh();
  };

  if (!timer) return null; // If timer is null, don't render anything

  const trimmedTitle =
    (timer.title || "Unknown Tab").length > 25
      ? (timer.title || "Unknown Tab").substring(0, 25) + "..."
      : timer.title || "Unknown Tab";

  return (
    <tr className="border-t">
      <td className="py-2 px-2" title={timer.title}>
        <div className="flex items-center">
          <img
            src={timer.favIconUrl}
            className="w-4 h-4 mr-2"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="truncate max-w-[150px]">{trimmedTitle}</span>
        </div>
      </td>
      <td className="py-2 px-2 text-center">{timeLeft}s</td>
      <td className="py-2 px-2 text-center">
        <span
          className={`px-2 py-1 rounded text-sm ${
            isPaused ? "bg-yellow-200" : "bg-green-200"
          }`}
        >
          {isPaused ? "Paused" : "Active"}
        </span>
      </td>
      <td className="py-2 px-2 text-center">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleAction(isPaused ? "resume" : "pause")}
            className={`text-gray-600 hover:text-${
              isPaused ? "green" : "yellow"
            }-500 transition`}
          >
            {isPaused ? (
              <PlayIcon className="h-5 w-5" />
            ) : (
              <PauseIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => handleAction("removeTimer")}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TimerRow;
