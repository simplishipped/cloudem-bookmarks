// Inject the injected.js script into the web page
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
document.documentElement.appendChild(script);

// Listen for messages from the injected script
window.addEventListener('message', function(event) {
  if (event.source !== window) return;

  if (event.data.type === 'METAMASK_RESULT') {
    chrome.runtime.sendMessage(event.data);
  }
});

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CRYPTO_ACCOUNT") {
    // Forward the message to the injected script
    window.postMessage({ type: 'METAMASK_CONNECT' }, '*');
  }
});
