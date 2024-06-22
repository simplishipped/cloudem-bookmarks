chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CRYPTO_ACCOUNT') {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  } else if (message.type === 'METAMASK_RESULT') {
    console.log('HEYOOO')
    // Forward the result to the popup script
    chrome.runtime.sendMessage(message);
  }
});
