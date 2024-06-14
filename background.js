// async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }

// background.js
// Listen for messages from the extension popup or other scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'REQUEST_ACCOUNTS') {
        // Forward the message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'REQUEST_ACCOUNTS' }, response => {
                    sendResponse(response);
                });
            } else {
                sendResponse({ success: false, error: 'No active tab' });
            }
        });
        // Return true to indicate asynchronous response
        return true;
    }
});
