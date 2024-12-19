document.getElementById('optionsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const defaultInterval = document.getElementById('defaultInterval').value;

    chrome.storage.sync.set({ defaultInterval: Number(defaultInterval) }, () => {
        alert('Options saved!');
    });
});

// Load saved options
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('defaultInterval', (data) => {
        document.getElementById('defaultInterval').value = data.defaultInterval || 30000; // Default to 30 seconds
    });
});