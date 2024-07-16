import { useSelector } from "../../store";
import userApi from "../../api/user-api";
import bookmarksApi from "../../api/bookmarks-api";
import log from "../../util/logger";
import useCommon from "./common-actions";
import { Bookmark, Collection } from "../../types/types";
import useUser from "./user-actions";
import Toggler from "../../components/atoms/toggler";



const useSettings = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const blockchain = () => app.state.chainName;
  const connectedToBlockchain = () => app.state.connectedToBlockchain;
  const startView = () => app.state.startView;
  const blockchainEnabled = () => app.state.blockchainEnabled;
  const confirmationsEnabled = () => app.state.confirmationsEnabled;
  const user = () => app.state.user;
  const mainCollection = () => app.state.mainCollection;
  const tempBookmarksEnabled = () => app.state.tempBookmarksEnabled;
  const common = useCommon();
  const userProps = useUser();

  // const enableBlockchain = async () => {
  //   try {
  //     if (!blockchainEnabled()) {
  //       setState(() => {
  //         return {
  //           ...app.state, globalLoader: true
  //         }
  //       })

  //       const accounts = await provider.send("eth_requestAccounts", []);
  //       const network = await provider.getNetwork();

  //       if (accounts.length > 0) {
  //         const auth = await userApi.getAuth();
  //         if (auth.data) {
  //           const update = await userApi.updateUser(user().id, { blockchain_enabled: true, walletaddr_arb: accounts[0] });
  //           if (update.data) {
  //             setState(() => {
  //               return {
  //                 ...app.state, connectedToBlockchain: true, blockchainEnabled: true, chainName: network.name, globalLoader: false
  //               }
  //             })
  //           } else {
  //             log.error(JSON.stringify({ function: 'enableBlockchain', error: 'Failed to enable blockchain', timestamp: new Date(), user_id: user().id })
  //             common.setError('Error enabling blockchain.', 'settingsError');
  //           }
  //         } else {
  //           log.error(JSON.stringify({ function: 'enableBlockchain', error: 'Failed to enable blockchain', timestamp: new Date(), user_id: user().id })
  //           common.setError('Error enabling blockchain.', 'settingsError');
  //         }
  //       } else {
  //         log.error(JSON.stringify({ function: 'enableBlockchain', error: 'Failed to enable blockchain', timestamp: new Date(), user_id: user().id })
  //         common.setError('Could not access you blockchain wallet', 'settingsError');
  //       }
  //     } else {
  //       disableBlockchain(user().id);
  //     }
  //   } catch (error) {
  //     log.error(JSON.stringify({ function: 'enableBlockchain', error, timestamp: new Date(), user_id: user().id })
  //     common.setError('Error enabling blockchain.', 'settingsError');
  //   }
  // }

  // const disableBlockchain = async (userId: number) => {
  //   try {
  //     //@ts-ignore
  //     const done = await userApi.disableBlockchain(userId);
  //     if (done.data) {
  //       setState(() => {
  //         return {
  //           ...app.state, blockchainEnabled: false, connectedToBlockchain: false
  //         }
  //       })
  //     } else {
  //       log.error(JSON.stringify({ function: 'disableBlockchain', error: done.error, timestamp: new Date(), user_id: user().id });
  //       common.setError('Error disabling blockchain.', 'settingsError');
  //       setState(() => {
  //         return {
  //           ...app.state
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     log.error(JSON.stringify({ function: 'disableBlockchain', error, timestamp: new Date(), user_id: user().id });
  //     common.setError('Error disabling blockchain.', 'settingsError');
  //   }
  // }

  const setConnected = (connected: boolean) => {
    setState(() => {
      return {
        ...app.state, connectedToBlockchain: connected
      }
    })
  }

  const setStartView = async (startView: boolean) => {
    const { data, error } = await userApi.updateUser(app.state.user.id, { start_view: startView });
    if (data) {
      setState(() => {
        return {
          ...app.state, startView,
        }
      })
    } else {
      common.setError('Error updating start view.', 'settingsError');
      log.error('set-start-view');
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
      log.error('export-bookmarks');
      common.setError('Error exporting bookmarks.', 'settingsError');
    }
  }

  const importBookmarks = async (e: any) => {
    function filterForExistingBookmarks(existingBookmarks: Bookmark[], bookmarks: Bookmark[]) {
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

          if (Array.isArray(inserted) && Array.isArray(insertedCollections)) {
            setState(() => {
              return {
                ...app.state, bookmarks: [...app.state.bookmarks, ...inserted], collections: [...app.state.collections, ...collections]
              }
            })
          } else {
            log.error('import-bookmarks');
            common.setError('Error importing bookmarks.', 'settingsError');
          }
        } catch (error) {
          log.error('import-bookmarks');
          common.setError('Error importing bookmarks.', 'settingsError');
        }
      }
      reader.readAsText(file);
    }
  }

  const saveUserUpdate = async (email: string | undefined, username: string | undefined, password: string | undefined) => {
    try {
      let user = {
        email,
        username,
        password
      }
      common.setGlobalLoader(true);
      await userProps.updateUser(user);
      common.setGlobalLoader(false);
    } catch (error) {
      log.error('save-user-update');
      common.setError('Error saving user update.', 'settingsError');
    }

  }

  const setConfirmationsEnabled = async () => {
    await userProps.updateUser({ confirmations_enabled: confirmationsEnabled() ? false : true });
    setState(() => {
      return {
        ...app.state, confirmationsEnabled: confirmationsEnabled() ? false : true
      }
    })
  }

  const setMainCollection = async (collection: Collection) => {
    try {
      // common.setGlobalLoader(true);
      let { data } = await userApi.updateUser(user().id, { main_collection: collection.id });
      if (data) {
        setState(() => {
          return { ...app.state, mainCollection: collection, collection }
        })
      } else {
        common.setError('Error updating main collection.', 'settingsError');
        log.error('set-main-collection');
      }

    } catch (err) {
      common.setError('Error updating main collection.', 'settingsError');
      log.error('set-main-collection');
    }

  }

  const enableTemporaryBookmarks = async() => {
    await userProps.updateUser({ temp_bookmarks_enabled: tempBookmarksEnabled() ? false : true });
    setState(() => {
      return {
        ...app.state, tempBookmarksEnabled: tempBookmarksEnabled() ? false : true
      }
    })
  }

  return {
    setConnected,
    blockchain,
    startView,
    setStartView,
    // enableBlockchain,
    connectedToBlockchain,
    blockchainEnabled,
    // disableBlockchain,
    exportBookmarks,
    importBookmarks,
    saveUserUpdate,
    setConfirmationsEnabled,
    confirmationsEnabled,
    setMainCollection,
    mainCollection,
    enableTemporaryBookmarks,
    tempBookmarksEnabled
  };
};

export default useSettings
