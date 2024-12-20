/* eslint-disable react/prop-types */
// components/TimerList.jsx
import React from "react";
import TimerRow from "./TimerRow";
import ErrorBoundary from "./ErrorBoundary";
import { validateTimers } from "../../utils/timerValidation";

const TABLE_HEADERS = [
  { id: "tab", label: "Tab", align: "left" },
  { id: "next", label: "Frequency", align: "center" },
  { id: "status", label: "Status", align: "center" },
  { id: "actions", label: "Actions", align: "center" },
];

function LoadingState() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-pulse text-gray-500">Loading timers...</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <p className="text-lg">No active timers</p>
      <p className="text-sm mt-2">Add a timer to get started</p>
    </div>
  );
}

function TimerList({ timers = {}, onRefresh, isLoading = false }) {
  // Validate timers data structure
  if (!validateTimers(timers)) {
    console.error("Invalid timers data structure:", timers);
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Invalid timer data received
      </div>
    );
  }

  const hasTimers = Object.keys(timers).length > 0;

  if (isLoading && !hasTimers) {
    return <LoadingState />;
  }

  if (!hasTimers) {
    return <EmptyState />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100">
            {TABLE_HEADERS.map(({ id, label, align }) => (
              <th
                key={id}
                className={`py-3 px-4 text-sm font-medium text-gray-700 text-${align} border-b`}
                scope="col"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(timers).map(([tabId, timer]) => (
            <ErrorBoundary key={tabId}>
              <TimerRow
                tabId={tabId}
                timer={timer}
                onRefresh={onRefresh}
                totalTime={timer.interval}
              />
            </ErrorBoundary>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add display name for better debugging
TimerList.displayName = "TimerList";

export default React.memo(TimerList);
