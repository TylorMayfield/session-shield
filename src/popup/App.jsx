/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from "react";
import TimerControls from "./components/TimerControls";
import TimerList from "./components/TimerList";
import KofiButton from "./components/KofiButton";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

const DEFAULT_INTERVAL = 30;
const DEFAULT_REFRESH_RATE = 1000;

function App() {
  const [state, setState] = useState({
    interval: DEFAULT_INTERVAL,
    timers: {},
    skipActiveTab: false,
    isLoading: true,
    error: null,
  });

  const { interval, timers, skipActiveTab, isLoading, error } = state;

  const handleChromeMessage = useCallback(async (action, data = {}) => {
    try {
      const response = await chrome.runtime.sendMessage({ action, ...data });
      return response;
    } catch (error) {
      console.error(`Chrome message error (${action}):`, error);
      setState((prev) => ({ ...prev, error: error.message }));
      return null;
    }
  }, []);

  const loadTimers = useCallback(async () => {
    const response = await handleChromeMessage("getActiveTimers");
    setState((prev) => ({
      ...prev,
      timers: response || {},
      isLoading: false,
    }));
  }, [handleChromeMessage]);

  useEffect(() => {
    const initializeSkipActiveTab = async () => {
      const response = await handleChromeMessage("getSkipActiveTab");
      setState((prev) => ({ ...prev, skipActiveTab: response }));
    };

    initializeSkipActiveTab();
  }, [handleChromeMessage]);

  useEffect(() => {
    loadTimers();
    const intervalId = setInterval(loadTimers, DEFAULT_REFRESH_RATE);
    return () => clearInterval(intervalId);
  }, [loadTimers]);

  const handleSkipActiveTabChange = useCallback(
    async (event) => {
      const newValue = event.target.checked;
      setState((prev) => ({ ...prev, skipActiveTab: newValue }));
      await handleChromeMessage("setSkipActiveTab", { value: newValue });
    },
    [handleChromeMessage]
  );

  const handleIntervalChange = useCallback((newInterval) => {
    setState((prev) => ({ ...prev, interval: newInterval }));
  }, []);

  const handleCreateTimer = useCallback(async () => {
    await handleChromeMessage("setInterval", { interval: Number(interval) });
    loadTimers();
  }, [interval, handleChromeMessage, loadTimers]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-6">
        <h1 className="flex items-center text-2xl font-bold text-green-600">
          Session Shield
          <ShieldCheckIcon className="w-8 h-8 text-green-600 ml-2" />
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-2">
            {error}
          </div>
        )}
      </header>

      <div className="flex items-center mb-4">
        <label className="mr-2">Skip active tab:</label>
        <input
          type="checkbox"
          checked={skipActiveTab}
          onChange={handleSkipActiveTabChange}
          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
        />
      </div>

      <TimerControls
        interval={interval}
        setInterval={handleIntervalChange}
        onCreateTimer={handleCreateTimer}
        disabled={isLoading}
      />

      <div className="mt-4">
        <KofiButton />
      </div>

      <TimerList timers={timers} onRefresh={loadTimers} isLoading={isLoading} />
    </div>
  );
}

export default App;
