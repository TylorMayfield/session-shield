let activeTimers = {};

function startTimer(tabId, interval) {
    // Ensure interval is in seconds
    if (activeTimers[tabId]) {
        clearInterval(activeTimers[tabId].timerId);
    }
    const timerId = setInterval(() => {
        console.log(`Timer for tab ${tabId} running`);
    }, interval * 1000); // Convert seconds to milliseconds
    activeTimers[tabId] = {
        timerId: timerId,
        interval: interval
    };
    chrome.storage.local.set({ activeTimers });
}

function pauseTimer(tabId) {
    if (activeTimers[tabId]) {
        clearInterval(activeTimers[tabId].timerId);
        chrome.storage.local.set({ activeTimers });
    }
}

function resumeTimer(tabId) {
    if (activeTimers[tabId]) {
        startTimer(tabId, activeTimers[tabId].interval);
    }
}

export { startTimer, pauseTimer, resumeTimer };
