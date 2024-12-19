import React, { useState, useEffect } from "react";

function Options() {
  const [settings, setSettings] = useState({
    defaultInterval: 30,
    notificationsEnabled: true,
    maxConcurrentTimers: 10,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await chrome.storage.local.get("settings");
    if (result.settings) {
      setSettings(result.settings);
    }
  };

  const saveSettings = async () => {
    await chrome.storage.local.set({ settings });
    // Show save confirmation
    const status = document.getElementById("status");
    status.textContent = "Settings saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 2000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        Focus Free Refresh Settings
      </h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Default Refresh Interval (seconds)
          </label>
          <input
            type="number"
            min="1"
            value={settings.defaultInterval}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultInterval: parseInt(e.target.value) || 30,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationsEnabled: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable Notifications
            </span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Maximum Concurrent Timers
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.maxConcurrentTimers}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxConcurrentTimers: parseInt(e.target.value) || 10,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={saveSettings}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
          <div id="status" className="mt-2 text-sm text-green-600"></div>
        </div>
      </div>
    </div>
  );
}

export default Options;
