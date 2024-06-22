console.log('Injected script executed.');

(async function() {
  // Your code using ethers.js
  async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return { success: true, account: accounts[0] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else {
      console.error('MetaMask not installed');
      return { success: false, error: 'MetaMask not installed' };
    }
  }

  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'METAMASK_CONNECT') {
      const connect = await connectMetaMask();
      window.postMessage({ type: 'METAMASK_RESULT', account: connect.account, success: connect.success }, '*');
    }
  });

  window.postMessage({ type: 'METAMASK_READY' }, '*');
})();
