document.getElementById('setInterval').addEventListener('click', () => {
    const interval = parseInt(document.getElementById('interval').value);
    chrome.runtime.sendMessage({action: 'setInterval', interval: Number(interval)});
    displayActiveTimers();
});

document.getElementById('pause').addEventListener('click', () => {  
    chrome.runtime.sendMessage({ action: 'pause' });
    displayActiveTimers();
});  

document.getElementById('resume').addEventListener('click', () => {  
    const interval = parseInt(document.getElementById('interval').value);
    chrome.runtime.sendMessage({ action: 'resume', interval: Number(interval) });
    displayActiveTimers();
});  

chrome.storage.sync.get(['refreshInterval', 'isPaused'], (data) => {  
    document.getElementById('interval').value = data.refreshInterval || 30;  
});  

function updateRefreshLog() {
    chrome.storage.sync.get('refreshLog', (data) => {
        const logContainer = document.getElementById('refreshLogBody');
        logContainer.innerHTML = ''; // Clear previous log entries
        if (Array.isArray(data.refreshLog) && data.refreshLog.length > 0) {
            data.refreshLog.forEach(entry => {
                const logEntry = document.createElement('tr');
                logEntry.innerHTML = `<td>${entry.tabId}</td><td>${entry.timestamp}</td>`;
                logContainer.appendChild(logEntry);
            });
        }
    });
}

function displayActiveTimers() {
    chrome.runtime.sendMessage({ action: 'getActiveTimers' }, (timers) => {
        console.log('Current timers:', timers);
        const container = document.getElementById('activeTimersContainer');
        container.innerHTML = `
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="py-2">Tab Name</th>
                        <th class="py-2">Interval</th>
                        <th class="py-2">Next Refresh</th>
                        <th class="py-2">Status</th>
                    </tr>
                </thead>
                <tbody id="activeTimersBody">
                </tbody>
            </table>
        `;
        
        const tbody = document.getElementById('activeTimersBody');
        
        if (!timers || Object.keys(timers).length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-2">No active timers</td>
                </tr>
            `;
            return;
        }

        Object.entries(timers).forEach(([tabId, timer]) => {
            chrome.tabs.get(parseInt(tabId), (tab) => {
                if (chrome.runtime.lastError || !tab) {
                    return;
                }
                const row = document.createElement('tr');
                row.id = `timer-row-${tabId}`;
                row.className = 'border-t';
                
                const timeUntilRefresh = Math.max(0, 
                    timer.lastRefresh + (timer.interval * 1000) - Date.now()
                );
                const secondsUntilRefresh = Math.ceil(timeUntilRefresh / 1000);
                
                row.innerHTML = `
                    <td class="py-2 px-2">${tab.title || 'Unknown Tab'}</td>
                    <td class="py-2 px-2">${timer.interval} seconds</td>
                    <td class="py-2 px-2 countdown" data-tabid="${tabId}">
                        ${secondsUntilRefresh}s
                    </td>
                    <td class="py-2 px-2">
                        <span class="px-2 py-1 rounded ${timer.isPaused ? 'bg-yellow-200' : 'bg-green-200'}">
                            ${timer.isPaused ? 'Paused' : 'Active'}
                        </span>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
    });
}

// Add auto-update functionality
function updateCountdowns() {
    chrome.runtime.sendMessage({ action: 'getActiveTimers' }, (timers) => {
        if (!timers) return;
        
        Object.entries(timers).forEach(([tabId, timer]) => {
            const countdownElement = document.querySelector(`.countdown[data-tabid="${tabId}"]`);
            if (countdownElement) {
                const timeUntilRefresh = Math.max(0, 
                    timer.lastRefresh + (timer.interval * 1000) - Date.now()
                );
                const secondsUntilRefresh = Math.ceil(timeUntilRefresh / 1000);
                countdownElement.textContent = `${secondsUntilRefresh}s`;
            }
        });
    });
}

// Start the countdown update interval when popup is opened
const countdownInterval = setInterval(updateCountdowns, 1000);

// Clean up interval when popup is closed
window.addEventListener('unload', () => {
    clearInterval(countdownInterval);
});

// Add this to your existing initialization
document.addEventListener('DOMContentLoaded', () => {
    updateRefreshLog();
    displayActiveTimers();
    loadLogs();
});

function loadLogs() {
    chrome.storage.sync.get('refreshLog', (data) => {
        const logContainer = document.getElementById('refreshLogBody');
        logContainer.innerHTML = '';
        
        if (data.refreshLog && Array.isArray(data.refreshLog) && data.refreshLog.length > 0) {
            data.refreshLog.forEach(entry => {
                const logEntry = document.createElement('tr');
                logEntry.innerHTML = `<td>${entry.tabId}</td><td>${entry.timestamp}</td>`;
                logContainer.appendChild(logEntry);
            });
        } else {
            console.warn("No refresh logs available.");
            logContainer.innerHTML = "<tr><td colspan='2' class='text-center'>No refresh logs available.</td></tr>";
        }
    });
}

