// Add at the start of the file
let skipActiveTab = false;
let activeTimers = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (activeTimers[tabId] && (changeInfo.title || changeInfo.favIconUrl)) {
    activeTimers[tabId].title = tab.title;
    activeTimers[tabId].favIconUrl = tab.favIconUrl;
    chrome.storage.local.set({ activeTimers });
    broadcastTimerUpdate();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getActiveTimers") {
    chrome.storage.local.get("timers", (result) => {
      sendResponse(result.timers || {});
    });
    return true;
  }
  if (message.action === "setSkipActiveTab") {
    skipActiveTab = message.value;
    chrome.storage.local.set({ skipActiveTab: message.value });
    sendResponse({ success: true });
    return true;
  }
  if (message.action === "getSkipActiveTab") {
    chrome.storage.local.get("skipActiveTab", (result) => {
      sendResponse(result.skipActiveTab || false);
    });
    return true;
  }
});

const refreshTab = async (tabId) => {
  if (skipActiveTab) {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (activeTab && activeTab.id === tabId) {
      return;
    }
  }
  chrome.tabs.reload(tabId);
  // Update the lastRefresh time when the tab is actually refreshed
  if (activeTimers[tabId]) {
    activeTimers[tabId].lastRefresh = Date.now();
    chrome.storage.local.set({ activeTimers });
    broadcastTimerUpdate();
  }
};

const startTimer = async (tabId, interval) => {
  if (activeTimers[tabId]) {
    clearInterval(activeTimers[tabId].timerId);
  }

  try {
    const tab = await chrome.tabs.get(tabId);

    activeTimers[tabId] = {
      interval,
      lastRefresh: Date.now(),
      timerId: setInterval(() => refreshTab(tabId), interval * 1000),
      title: tab.title,
      favIconUrl: tab.favIconUrl,
      url: tab.url,
    };

    chrome.storage.local.set({ activeTimers });
    broadcastTimerUpdate();
  } catch (error) {
    console.error("Error starting timer:", error);
  }
};

const broadcastTimerUpdate = () => {
  chrome.runtime.sendMessage({
    action: "timerUpdate",
    timers: activeTimers,
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "setInterval":
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0]) {
          await startTimer(tabs[0].id, request.interval);
          sendResponse({ success: true });
        }
      });
      break;

    case "removeTimer":
      if (activeTimers[request.tabId]) {
        clearInterval(activeTimers[request.tabId].timerId);
        delete activeTimers[request.tabId];
        chrome.storage.local.set({ activeTimers });
        broadcastTimerUpdate();
        sendResponse({ success: true });
      }
      break;

    case "pause":
      if (activeTimers[request.tabId]) {
        clearInterval(activeTimers[request.tabId].timerId);
        activeTimers[request.tabId].isPaused = true;
        chrome.storage.local.set({ activeTimers });
        broadcastTimerUpdate();
        sendResponse({ success: true });
      }
      break;

    case "resume":
      if (activeTimers[request.tabId]) {
        startTimer(request.tabId, activeTimers[request.tabId].interval);
        sendResponse({ success: true });
      }
      break;

    case "getActiveTimers":
      sendResponse(activeTimers);
      break;
  }
  return true;
});
