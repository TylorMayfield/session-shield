let refreshInterval = 30; // Default to 30 seconds  
let isPaused = false;  
let activeTimers = {};  
let refreshLog = [];


function logRefresh(tabId) {
    const timestamp = new Date().toLocaleString();
    const logEntry = { tabId, timestamp };
    
    chrome.storage.sync.get('refreshLog', (data) => {
        const log = data.refreshLog || [];
        log.unshift(logEntry);
        // Keep only the last 100 entries
        const trimmedLog = log.slice(0, 3);
        chrome.storage.sync.set({ refreshLog: trimmedLog });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  
    if (request.action === 'pause') {  
        isPaused = true;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                if (activeTimers[tabId]) {
                    activeTimers[tabId].isPaused = true;
                }
            }
        });
    } else if (request.action === 'resume') {
        isPaused = false;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                if (activeTimers[tabId]) {
                    activeTimers[tabId].isPaused = false;
                    activeTimers[tabId].interval = request.interval;
                    activeTimers[tabId].lastRefresh = Date.now();
                }
            }
        });
    } else if (request.action === 'setInterval') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                activeTimers[tabId] = {
                    interval: request.interval,
                    isPaused: false,
                    lastRefresh: Date.now()
                };
                refreshInterval = request.interval;
                chrome.storage.sync.set({ refreshInterval });
            }
        });
    } else if (request.action === 'getActiveTimers') {
        sendResponse(activeTimers);
        return true;
    }
});

function refreshTab(tabId) {
    if (isPaused) return;
    
    const timer = activeTimers[tabId];
    if (timer && !timer.isPaused) {
        chrome.tabs.get(parseInt(tabId), (tab) => {
            if (chrome.runtime.lastError) {
                delete activeTimers[tabId];
                chrome.storage.sync.set({ activeTimers });
                return;
            }
            if (tab) {
                chrome.tabs.query({active: true, currentWindow: true}, (activeTabs) => {
                    if (activeTabs[0].id !== tab.id) {
                        chrome.tabs.reload(parseInt(tabId), () => {
                            if (chrome.runtime.lastError) {
                                console.error('Failed to refresh tab:', chrome.runtime.lastError);
                                return;
                            }
                            logRefresh(parseInt(tabId));
                        });
                    } else {
                        // Update lastRefresh even if we skip the refresh
                        timer.lastRefresh = Date.now();
                    }
                });
            }
        });
    }
}

function broadcastTimerUpdate() {
    chrome.runtime.sendMessage({ 
        action: 'timersUpdated', 
        timers: activeTimers 
    });
}


setInterval(() => {
    const currentTime = Date.now();
    Object.entries(activeTimers).forEach(([tabId, timer]) => {
        if (!timer.isPaused && (currentTime - timer.lastRefresh >= timer.interval * 1000)) {
            refreshTab(tabId);
            timer.lastRefresh = currentTime;
        } else if (request.action === 'setInterval') {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs.length > 0) {
                    const tabId = tabs[0].id;
                    activeTimers[tabId] = {
                        interval: request.interval,
                        isPaused: false,
                        lastRefresh: Date.now()
                    };
                    refreshInterval = request.interval;
                    chrome.storage.sync.set({ 
                        refreshInterval,
                        activeTimers: activeTimers 
                    });
                    broadcastTimerUpdate(); // Broadcast the update
                }
            });
        }
    });
}, 1000);