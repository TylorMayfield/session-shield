import { useState, useEffect } from "react";
import TimerControls from "./components/TimerControls";
import TimerList from "./components/TimerList";
import KofiButton from "./components/KofiButton";

function App() {
  const [interval, setInterval] = useState(30);
  const [timers, setTimers] = useState({});
  const [skipActiveTab, setSkipActiveTab] = useState(false);

  useEffect(() => {
    // Load initial skip active tab setting
    chrome.runtime.sendMessage({ action: "getSkipActiveTab" }, (response) => {
      setSkipActiveTab(response);
    });
  }, []);

  const handleSkipActiveTabChange = (event) => {
    const newValue = event.target.checked;
    setSkipActiveTab(newValue);
    chrome.runtime.sendMessage({
      action: "setSkipActiveTab",
      value: newValue,
    });
  };

  useEffect(() => {
    const handleTimerUpdate = (message) => {
      if (message.action === "timerUpdate") {
        setTimers(message.timers);
      }
    };

    chrome.runtime.onMessage.addListener(handleTimerUpdate);
    return () => chrome.runtime.onMessage.removeListener(handleTimerUpdate);
  }, []);

  useEffect(() => {
    loadTimers();
    const intervalId = setInterval(loadTimers, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const loadTimers = async () => {
    const response = await chrome.runtime.sendMessage({
      action: "getActiveTimers",
    });
    setTimers(response || {});
  };

  const handleCreateTimer = async () => {
    await chrome.runtime.sendMessage({
      action: "setInterval",
      interval: Number(interval),
    });
    loadTimers();
  };

  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md min-w-[400px]">
      <h1 className="text-2xl font-semibold text-green-600 mb-4">
        Focus Free Refresh
      </h1>
      <div className="flex items-center mb-4">
        <label className="mr-2">Skip active tab:</label>
        <input
          type="checkbox"
          checked={skipActiveTab}
          onChange={handleSkipActiveTabChange}
        />
      </div>
      <TimerControls
        interval={interval}
        setInterval={setInterval}
        onCreateTimer={handleCreateTimer}
      />
      <KofiButton />
      <TimerList timers={timers} onRefresh={loadTimers} />
    </div>
  );
}

export default App;
