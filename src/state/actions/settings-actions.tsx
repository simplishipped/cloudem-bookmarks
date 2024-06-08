import { useSelector } from "../../store";
import { ethers } from 'ethers';
import userApi from "../../api/user-api";
import bookmarksApi from "../../api/bookmarks-api";
import log from "../../util/logger";
import useCommon from "./common-actions";
import { Bookmark, Collection } from "../../types/types";

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
      let bookmarks = app.state.bookmarks;
      let exportFile = {
        bookmarks: bookmarks,
        collections: app.state.collections,
      }
      var fileToSave = new Blob([JSON.stringify(exportFile)], {
        type: 'application/json'
      });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(fileToSave);
      a.download = 'bookmarks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      log.error({ function: 'exportBookmarks', error, timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-6' });
      common.setError('Error exporting bookmarks.', 'settingsError');
    }
  }

  const importBookmarks = async (e: any) => {
    function filterForExistingBookmarks(existingBookmarks: Bookmark[],bookmarks: Bookmark[]) {
      const filtered = bookmarks.filter(bk => {
        let exists = existingBookmarks.find(ebk => ebk.name === bk.name);
        return !exists;
      })
      return filtered
    }

    function filterForExistingCollections(existingCollections: Collection[], collections: Collection[]) {
      const filtered = collections.filter(c => {
        let exists = existingCollections.find(ec => ec.name === c.name);
        return !exists;
      })
      return filtered
    }

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
        const fileContent = event.target.result;
        const bookmarksFile = JSON.parse(fileContent);
        let bookmarks = bookmarksFile.bookmarks;
        let collections = bookmarksFile.collections;
        bookmarks = filterForExistingBookmarks(app.state.bookmarks, bookmarks);
        collections = filterForExistingCollections(app.state.collections, collections);
        const inserted = await bookmarksApi.addBookmarks(bookmarks);
        const insertedCollections = await bookmarksApi.createCollections(collections);

        if(inserted && insertedCollections) {
          setState(() => {
            return {
              ...app.state, bookmarks: [...app.state.bookmarks, ...bookmarks], collections: [...app.state.collections, ...collections]
            }
          })
        } else {
          log.error({ function: 'importBookmarks', error: 'Failed to import bookmarks', timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-8' });
          common.setError('Error importing bookmarks.', 'settingsError');
        } 
        } catch (error) {
          log.error({ function: 'importBookmarks', error, timestamp: new Date(), user_id: user().id, log_id: 'settings-actions-7' });
          common.setError('Error importing bookmarks.', 'settingsError');
        }
      }
      reader.readAsText(file);
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
    exportBookmarks,
    importBookmarks
  };
};

export default useSettings
