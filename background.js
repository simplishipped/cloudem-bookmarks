
import { ethers } from "./ethers.min.js";
const provider = new ethers.BrowserProvider(window.ethereum);

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.type === 'REQUEST_CRYPTO_ACCOUNT') {

		try {
			const accounts = await provider.send("eth_requestAccounts", []);
			sendResponse({ success: true, account: accounts[0] });
		} catch (error) {
			console.log(error)
			sendResponse({ success: false, error })
		}
		// Return true to indicate asynchronous response
		return true;
	}
});
