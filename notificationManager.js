function notifyTabRefreshed(tab) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Tab Refreshed',
        message: `The tab ${tab.title} has been refreshed!`,
        priority: 1
    });
}

export { notifyTabRefreshed };
