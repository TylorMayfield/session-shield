/* eslint-disable react/prop-types */

function TimerControls({ interval, setInterval, onCreateTimer }) {
  return (
    <div className="flex space-x-2 mb-4">
      <input
        type="number"
        value={interval}
        onChange={(e) =>
          setInterval(Math.max(1, parseInt(e.target.value) || 1))
        }
        className="w-20 px-2 py-1 border rounded"
        min="1"
        defaultValue={30}
        max="60"
      />
      <button
        onClick={onCreateTimer}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition ease-in-out duration-300"
      >
        Create Timer
      </button>
    </div>
  );
}

export default TimerControls;
