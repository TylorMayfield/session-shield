function saveActiveTimers(timers) {
    chrome.storage.local.set({ activeTimers: timers });
}

function getActiveTimers(callback) {
    chrome.storage.local.get('activeTimers', (data) => {
        callback(data.activeTimers || {});
    });
}

export { saveActiveTimers, getActiveTimers };
