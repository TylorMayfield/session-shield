
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  
    if (request.action === 'refresh') {  
        location.reload();  
    } else if (request.action === 'checkTimer') {  
        const hasActiveTimer = !!(request.tabId in activeTimers);  
        sendResponse({hasActiveTimer});  
    }  
});
