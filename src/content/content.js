// Content script for Focus Free Refresh
console.log("Focus Free Refresh content script loaded");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "refreshPage") {
    window.location.reload();
  }
  return true;
});
