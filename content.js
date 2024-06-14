// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REQUEST_ACCOUNTS') {
      if (typeof window.ethereum !== 'undefined') {
          window.ethereum
              .request({ method: 'eth_requestAccounts' })
              .then(accounts => {
                  sendResponse({ success: true, accounts });
              })
              .catch(error => {
                  sendResponse({ success: false, error: error.message });
              });
      } else {
          sendResponse({ success: false, error: 'MetaMask not installed' });
      }
      // Return true to indicate asynchronous response
      return true;
  }
});   