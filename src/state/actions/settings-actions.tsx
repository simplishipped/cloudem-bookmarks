import { useSelector } from "../../store";
import { ethers } from 'ethers';
import userApi from "../../api/user-api";
import bookmarksApi from "../../api/bookmarks-api";
import log from "../../util/logger";
import useCommon from "./common-actions";

const provider = new ethers.BrowserProvider((window as any).ethereum);


const useSettings = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const blockchain = () => app.state.chainName;
  const connectedToBlockchain = () => app.state.connectedToBlockchain;
  const startView = () => app.state.startView;
  const blockchainEnabled = () => app.state.blockchainEnabled;
  const user = () => app.state.user;
  const common = useCommon();

  const enableBlockchain = async () => {
    try {
      if (!blockchainEnabled()) {
        setState(() => {
          return {
            ...app.state, globalLoader: true
          }
        })

        const accounts = await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();

        if (accounts.length > 0) {
          const auth = await userApi.getAuth();
          if (auth.data) {
            const update = await userApi.updateUser(user().id, { blockchain_enabled: true, walletaddr_arb: accounts[0] });
            if (update.data) {
              setState(() => {
                return {
                  ...app.state, connectedToBlockchain: true, blockchainEnabled: true, chainName: network.name, globalLoader: false
                }
              })
            } else {
              log.error({ function: 'enableBlockchain', error: 'Failed to enable blockchain', timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-2' })
              common.setError('Error enabling blockchain.', 'settingsError');
            }
          } else {
            log.error({ function: 'enableBlockchain', error: 'Failed to enable blockchain', timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-3' })
            common.setError('Error enabling blockchain.', 'settingsError');
          }
        } else {
          log.error({ function: 'enableBlockchain', error: 'Failed to enable blockchain', timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-4' })
          common.setError('Could not access you blockchain wallet', 'settingsError');
        }
      } else {
        disableBlockchain(user().id);
      }
    } catch (error) {
      log.error({ function: 'enableBlockchain', error, timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-1' })
      common.setError('Error enabling blockchain.', 'settingsError');
    }
  }

  const disableBlockchain = async (userId: number) => {
    try {
      //@ts-ignore
      const done = await userApi.disableBlockchain(userId);
      if (done.data) {
        setState(() => {
          return {
            ...app.state, blockchainEnabled: false, connectedToBlockchain: false
          }
        })
      } else {
        log.error({ function: 'disableBlockchain', error: done.error, timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-6' });
        common.setError('Error disabling blockchain.', 'settingsError');
        setState(() => {
          return {
            ...app.state
          }
        })
      }
    } catch (error) {
      log.error({ function: 'disableBlockchain', error, timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-5' });
      common.setError('Error disabling blockchain.', 'settingsError');
    }
  }

  const setConnected = (connected: boolean) => {
    setState(() => {
      return {
        ...app.state, connectedToBlockchain: connected
      }
    })
  }

  const setStartView = async (startView: boolean) => {
    //@ts-ignore
    const data = await userApi.updateUser(app.state.user.id, { start_view: startView });
    if (data) {
      setState(() => {
        return {
          ...app.state, startView,
        }
      })
    }

  }


  const exportBookmarks = async () => {
    try {
      //@ts-ignore
      let bookmarks = await bookmarksApi.getBookmarksByUser(app.state.user.id);
      var fileToSave = new Blob([JSON.stringify(bookmarks)], {
        type: 'application/json'
      });

      const a = document.createElement('a');
      const type = 'application/json'
      a.href = URL.createObjectURL(fileToSave);
      a.download = 'bookmarks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.log(err);
    }
  }


  return {
    setConnected,
    blockchain,
    startView,
    setStartView,
    enableBlockchain,
    connectedToBlockchain,
    blockchainEnabled,
    disableBlockchain,
    exportBookmarks
  };
};

export default useSettings;
