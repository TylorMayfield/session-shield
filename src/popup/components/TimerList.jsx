import TimerRow from "./TimerRow";

function TimerList({ timers, onRefresh }) {
  if (!timers || Object.keys(timers).length === 0) {
    return <div className="text-center py-4">No active timers</div>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-2 text-left">Tab</th>
          <th className="py-2 px-2 text-center">Next</th>
          <th className="py-2 px-2 text-center">Status</th>
          <th className="py-2 px-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(timers).map(([tabId, timer]) => (
          <TimerRow
            key={tabId}
            tabId={tabId}
            timer={timer}
            totalTime={timer.totalTime}
            onRefresh={onRefresh}
          />
        ))}
      </tbody>
    </table>
  );
}

export default TimerList;
