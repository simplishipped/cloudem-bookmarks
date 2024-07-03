import { useSelector } from "../../store";
import { Bookmark, Collection, Nftmark, SelectChoice } from "../../types/types";
import bookmarksApi from "../../api/bookmarks-api";
import log from "../../util/logger";
import useCommon from "./common-actions";
import capitalizeFirstLetter from "../../util/capitalize-word";
import { organizeCollectionsWithSubs } from "../../util/organizeCollections";

const useContent = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const nftmarks = () => app.state.nftmarks;
  const bookmarks = () => app.state.bookmarks;
  const loading = () => app.state.loading;
  const marksView = () => app.state.marksView;
  const collection = () => app.state.collection;
  const initCollections = () => app.state.initCollections;
  const collections = () => app.state.collections;
  const markToMint = () => app.state.markToMint;
  const nftmarkName = () => app.state.nftmarkName;
  const nftCategory = () => app.state.nftCategory;
  const search = () => app.state.search;
  const checkedBookmarks = () => app.state.checkedBookmarks;
  const startView = () => app.state.startView;
  const newCollection = () => app.state.newCollection;
  const user = () => app.state.user
  const newCollectionParentId = () => app.state.newCollectionParentId;
  const confirmedAction = () => app.state.confirmedAction;

  const common = useCommon();

  const setSearch = (search: string) => {
    setState(() => {
      return { ...app.state, search }
    })
  }


  const setBookmarkChecked = (id: number) => {
    let clone = app.state.checkedBookmarks.slice();

    if (clone.includes(id)) {
      clone.splice(clone.indexOf(id), 1);
    } else {
      clone.push(id);
    }

    setState(() => {
      return {
        ...app.state,
        checkedBookmarks: clone
      }
    })
  }

  const resetBookmarksChecked = () => {
    setState(() => {
      return {
        ...app.state,
        checkedBookmarks: []
      }
    })
  }


  const setAllBookmarksChecked = () => {
    setState(() => {
      return {
        ...app.state,
        bookmarks: app.state.bookmarks.map(b => {
          return { ...b, checked: true }
        })
      }
    })
  }

  const setLoading = (type: string, bool: Boolean) => {
    setState(() => {
      return { ...app.state, loading: { ...app.state.loading, [type]: bool } }
    })
  }


  const addBookmark = async (bookmark: Bookmark) => {
    try {
      const collections = await bookmarksApi.getCollectionsByUser(bookmark.user_id);
      let exists = false;
      let collectionName: string;
      if (newCollectionParentId()) {
        collectionName = bookmark.collection.split('>')[1].trim()
        bookmark.collection = collectionName
      }
      if (collections.data) {
        //@ts-ignore
        exists = collections.data.find(c => c.name.toLowerCase() === bookmark.collection.toLowerCase());
      }
      if (!exists) {
        let newCollection: any;
        if (!newCollectionParentId()) {
          let collection = {
            name: bookmark.collection,
            user_id: bookmark.user_id,
            is_root: true
          }
          collectionName = bookmark.collection;
          newCollection = await bookmarksApi.createCollection(collection);
        } else {
          let collection = {
            name: bookmark.collection,
            user_id: bookmark.user_id,
            is_root: false,
            parent_id: newCollectionParentId()
          }
          newCollection = await bookmarksApi.createCollection(collection);
        }
        if (newCollection.data) {
          const bk = await bookmarksApi.addBookmark(bookmark);
          if (bk.data) {
            setState(() => {
              return {
                ...app.state, bookmarks: [bk.data, ...app.state.bookmarks], collections: organizeCollectionsWithSubs([newCollection.data, ...initCollections()]),
                collection: bookmark.collection, initCollections: [newCollection.data, ...initCollections()]
              }
            })
            return true;

          } else {
            common.setError('Failed to add bookmark', 'addBookmarkError');
            log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-1' });
            return false;
          }

        } else {
          common.setError('Failed to add bookmark', 'addBookmarkError');
          log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-2' });
          return false;
        }

      } else {

        //@ts-ignore
        if (exists && !newCollectionParentId) {
          common.setError('Collection already exists.', 'addBookmarkError');
          //@ts-ignore
        } else if (exists && newCollectionParentId()) {
          //@ts-ignore
          if (exists.parent_id === newCollectionParentId() && collectionName === exists.name) {
            common.setError('Collection already exists.', 'globalError')
          } else {
            const bk = await bookmarksApi.addBookmark(bookmark);
            if (bk.data) {
              setState(() => {
                return { ...app.state, bookmarks: [bk.data, ...app.state.bookmarks], collection: bk.data.collection }
              })
              return true;
            } else {
              common.setError('Failed to add bookmark', 'addBookmarkError');
              log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-3' });
              return false;
            }
          }
        } else {
          const bk = await bookmarksApi.addBookmark(bookmark);
          if (bk.data) {
            setState(() => {
              return { ...app.state, bookmarks: [bk.data, ...app.state.bookmarks], collection: bk.data.collection }
            })
            return true;
          } else {
            common.setError('Failed to add bookmark', 'addBookmarkError');
            log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-3' });
            return false;
          }
        }

      }


    } catch (error) {
      common.setError('Failed to add bookmark', 'addBookmarkError');
      log.error({ function: 'addBookmark', error: error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-4' });
      return false;

    }
  }

  const deleteBookmarks = async () => {
    try {
      if (app.state.checkedBookmarks.length > 0) {
        // @ts-ignore
        const res = await bookmarksApi.deleteBookmarks(app.state.checkedBookmarks);
        if (!res.error) {
          setState(() => {
            //@ts-ignore
            return { ...app.state, bookmarks: app.state.bookmarks.filter(b => !app.state.checkedBookmarks.includes(b.id)), checkedBookmarks: [] }
          })
        } else {
          common.setError('Failed to delete bookmark', 'homeError');
          log.error({ function: 'deleteBookmarks', error: res.error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-5' });
        }
      }

    } catch (error) {
      common.setError('Failed to delete bookmark', 'homeError');
      log.error({ function: 'deleteBookmarks', error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-11' });
    }
  }

  const setMarkToMintAndNavToMintPage = () => {
    const nftmark = {
      bookmarks: bookmarks().filter(b => b.collection === app.state.collection),
      name: app.state.collection,
      userId: app.state.user.id,
      category: nftCategory()
    }
    setState(() => {
      return { ...app.state, markToMint: nftmark }
    })
    // props.setMarkToMint(nftmark);
  }

  const getUserBookmarks = async () => {
    try {
      if (bookmarks().length === 0) {
        setLoading('bookmarks', true);
        //@ts-ignore
        let localMarks = localStorage.getItem('bookmarks');
        if (localMarks) {
          setLoading('bookmarks', false);
          setState(() => {
            return { ...app.state, bookmarks: JSON.parse(localMarks)}
          })
        }
        
        const marks = await bookmarksApi.getBookmarksByUser(user().id);
        localStorage.setItem('bookmarks', JSON.stringify(marks.data));
        setLoading('bookmarks', false);
        if (marks.data) {
          setState(() => {
            return { ...app.state, bookmarks: marks.data }
          })
        } else {
          common.setError('Failed to fetch user bookmarks', 'homeError');
          log.error({ function: 'getUserBookmarks', error: 'Failed to fetch bookmarks', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-6' });
        }
      }
    } catch (error) {
      common.setError('Failed to fetch user bookmarks', 'homeError');
      log.error({ function: 'getUserBookmarks', error: 'Failed to fetch bookmarks', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-7' });
    }
  }

  const getUserCollections = async () => {
    if (collections().length === 0) {
      setLoading('collections', true);
      let collections: any = [];
      const localCollections = localStorage.getItem('collections');
      if (localCollections) {
        setLoading('collections', false);
        setState(() => {
          return {
            ...app.state,
            collections: organizeCollectionsWithSubs(JSON.parse(localCollections)),
            initCollections: JSON.parse(localCollections)
          }
        })
      }
      if (user().email) {
        collections = await bookmarksApi.getCollectionsByUser(user().id);
      } else {
        collections = await bookmarksApi.getCollectionsByUserWalletAddr(user().walletaddr_arb);
      }

      localStorage.setItem('collections', JSON.stringify(collections));
      setLoading('collections', false);
      if (collections.data) {
        const collectionsOrganized = organizeCollectionsWithSubs(collections.data);
        setState(() => {
          return { ...app.state, collections: collectionsOrganized, initCollections: collections.data }
        })
      } else {
        common.setError('Failed get user collections', 'globalError');
        log.error({ function: 'getUserCollections', error: 'Failed to fetch collections', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-8' });
      }
    }
  }

  const deleteCollection = async (collection: any) => {
    try {
      const res = await bookmarksApi.deleteCollection(collection.id);
      if (!res.error) {
        let removedFromCollections = initCollections().filter(c => c.id !== collection.id);
        let reorganized = organizeCollectionsWithSubs(removedFromCollections);
        setState(() => {
          return { ...app.state, collections: reorganized }
        })
        return true;
      } else {
        common.setError('Failed to delete collection', 'globalError');
        log.error({ function: 'deleteCollection', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-9' });
        return false;
      }
    } catch (error) {
      common.setError('Failed to delete collection', 'globalError');
      log.error({ function: 'deleteCollection', error: error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-10' });
      return false;
    }
  }

  async function syncBookmarksToDatabase() {
    try {
      let bookmarkTreeNodes: any;
      //@ts-ignore
      if (window.chrome) {
        //@ts-ignore
        bookmarkTreeNodes = await new Promise((resolve) => {
          ///@ts-ignore
          window.chrome.bookmarks.getTree(resolve);
        });

        let children = bookmarkTreeNodes[0].children;
        children[1].title = 'default';
        bookmarkTreeNodes = [...children[0].children, children[1]];
        //@ts-ignore
      } else if (window.browser) {
        // Firefox environment
        //@ts-ignore
        bookmarkTreeNodes = await browser.bookmarks.getTree();
      } else {
        return; // Exit if not in a Chrome or Firefox environment
      }
      // Mapping from original IDs to new IDs from the database
      const collectionsIdMap = new Map();

      async function processNode(node: any, parentCollectionId?: number, collectionName?: string) {
        const existingBookmarks = await bookmarksApi.getBookmarksByUser(user().id);
        const existingCollections = await bookmarksApi.getCollectionsByUser(user().id);


        if (node.children) {
          // It's a folder, create or find a collection
          const folderName = node.title.toLowerCase();

          // Check if collection already exists (case-insensitive)

          let collectionId = null;
          let existingCollection = null;

          if (existingCollections.data) {
            existingCollection = existingCollections.data.find(
              (c) => c.name.toLowerCase() === folderName
            );
          }

          if (!existingCollection) {
            const collection = {
              name: node.title,
              parent_id: parentCollectionId,
              user_id: user().id,
            };
            const createdCollection = await bookmarksApi.createCollection(collection);
            collectionId = createdCollection.data.id;
            collectionsIdMap.set(node.id, collectionId); // Map original ID to new database ID
          } else {
            collectionId = existingCollection.id;
            collectionsIdMap.set(node.id, collectionId); // Map original ID to existing collection ID
          }

          // Process children
          for (const childNode of node.children) {
            await processNode(childNode, collectionId, folderName);
          }
        } else {
          //@ts-ignore
          let exists = existingBookmarks.data.find(eb => eb.url === node.url);
          if (!exists) {
            const bookmark = {
              name: node.title,
              url: node.url,
              collection_id: parentCollectionId,
              collection: collectionName,
              user_id: user().id,
            };
            //@ts-ignore
            const createdBookmark = await bookmarksApi.addBookmark(bookmark);
            collectionsIdMap.set(node.id, createdBookmark.data.id);
          }
        }
      }

      // Process the top-level nodes
      for (const node of bookmarkTreeNodes) {
        await processNode(node);
      }

      return true;
      // Retrieve combined bookmarks with new IDs

    } catch (error) {
      common.setError('Failed to fetch updated bookmarks', 'globalError');
      log.error({ function: 'syncBookmarsFromBrowser', error: error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-13' });
      return false;
    }

  }

  const syncBookmarksFromBrowser = async () => {
    let done = await syncBookmarksToDatabase();
    const collections = await bookmarksApi.getCollectionsByUser(user().id);
    const bookmarks = await bookmarksApi.getBookmarksByUser(user().id);

    if (!done) {
      return false;
    }

    if (collections.data && bookmarks.data) {
      //@ts-ignore
      setState(() => {
        return {
          ...app.state,
          collections: organizeCollectionsWithSubs(collections.data),
          initCollections: collections.data,
          bookmarks: bookmarks.data
        };
      });
    } else {
      common.setError('Failed to fetch updated bookmarks', 'globalError');
      log.error({ function: 'syncBookmarsFromBrowser', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-13' });
      return false;
    }

  }

  async function syncDatabaseToBrowser() {
    // Fetch collections and bookmarks from the database
    const collectionsResponse = await bookmarksApi.getCollectionsByUser(user().id);
    const bookmarksResponse = await bookmarksApi.getBookmarksByUser(user().id);

    if (collectionsResponse.data && bookmarksResponse.data) {
      const collections: Collection[] = collectionsResponse.data;
      const bookmarks: Bookmark[] = bookmarksResponse.data;

      // Function to create a folder in Chrome or Firefox
      async function createFolder(name: string, parentId: string): Promise<any> {
        //@ts-ignore
        if (window.chrome && window.chrome.bookmarks) {
          return new Promise((resolve) => {
            //@ts-ignore
            window.chrome.bookmarks.create({ title: name, parentId: parentId }, (folder: any) => resolve(folder));
          });
          //@ts-ignore
        } else if (window.browser && window.browser.bookmarks) {
          //@ts-ignore
          return window.browser.bookmarks.create({ title: name, parentId: parentId });
        } else {
          common.setError('Failed to sync bookmarks', 'globalError');
          log.error({ function: 'syncDatabaseToBrowser', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-15' });
          return false;
        }

      }

      // Function to create a bookmark in Chrome or Firefox
      async function createBookmark(name: string, url: string, parentId: string): Promise<any> {
        //@ts-ignore
        if (window.chrome && window.chrome.bookmarks) {
          return new Promise((resolve) => {
            //@ts-ignore
            window.chrome.bookmarks.create({ title: name, url: url, parentId: parentId }, (bookmark: any) => resolve(bookmark));
          });
          //@ts-ignore
        } else if (window.browser && window.browser.bookmarks) {
          //@ts-ignore
          return window.browser.bookmarks.create({ title: name, url: url, parentId: parentId });
        } else {
          common.setError('Failed to sync bookmarks', 'globalError');
          log.error({ function: 'syncDatabaseToBrowser', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-16' });
          return false;
        }
      }

      // Function to find a folder by name in Chrome or Firefox
      async function findFolderByName(name: string, parentId: string) {
        //@ts-ignore
        if (window.chrome && window.chrome.bookmarks) {
          return new Promise((resolve) => {
            //@ts-ignore
            window.chrome.bookmarks.search({ title: name }, (results: any) => {
              const folder = results.find((result: any) => result.parentId === parentId && result.url === undefined);
              resolve(folder ? [folder] : []);
            });
          });
          //@ts-ignore
        } else if (window.browser && window.browser.bookmarks) {
          //@ts-ignore
          const results = await window.browser.bookmarks.search({ title: name });
          const folder = results.find((result: any) => result.parentId === parentId && result.url === undefined);
          return folder ? [folder] : [];
        } else {
          common.setError('Failed to sync bookmarks', 'globalError');
          log.error({ function: 'syncDatabaseToBrowser', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-17' });
          return false;
        }
      }

      // Function to find a bookmark by URL in Chrome or Firefox
      async function findBookmarkByUrl(url: string, parentId: string) {
        //@ts-ignore
        if (window.chrome && window.chrome.bookmarks) {
          return new Promise((resolve) => {
            //@ts-ignore
            window.chrome.bookmarks.search({ url: url }, (results: any) => {
              const bookmark = results.find((result: any) => result.parentId === parentId);
              resolve(bookmark ? [bookmark] : []);
            });
          });
          //@ts-ignore
        } else if (window.browser && window.browser.bookmarks) {
          //@ts-ignore
          const results = await window.browser.bookmarks.search({ url: url });
          const bookmark = results.find((result: any) => result.parentId === parentId);
          return bookmark ? [bookmark] : [];
        } else {
          common.setError('Failed to sync bookmarks', 'globalError');
          log.error({ function: 'syncDatabaseToBrowser', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-18' });
          return false;
        }
      }

      // Create folders in Chrome or Firefox
      const collectionIdMap: { [key: number]: string } = {}; // Map to store the relation between collection IDs and created folder IDs
      for (const collection of collections) {
        const parentId = collection.parent_id ? collectionIdMap[collection.parent_id] : '1'; // '1' is the ID of the bookmarks bar
        const existingFolders = await findFolderByName(collection.name, parentId);

        let folder;
        //@ts-ignore
        if (existingFolders.length > 0) {
          //@ts-ignore
          folder = existingFolders[0];
        } else {
          folder = await createFolder(collection.name, parentId);
        }
        //@ts-ignore
        collectionIdMap[collection.id] = folder.id; // Store the relation
      }

      // Create bookmarks in Chrome or Firefox
      for (const bookmark of bookmarks) {
        //@ts-ignore
        const parentId = collectionIdMap[bookmark.collection_id] || '1'; // Default to bookmarks bar if no parent

        const existingBookmarks = await findBookmarkByUrl(bookmark.url, parentId);
        //@ts-ignore
        if (existingBookmarks.length === 0) {
          await createBookmark(bookmark.name, bookmark.url, parentId);
        }
      }
    }
  }




  const setCategory = (category: string) => {
    setState(() => {
      return { ...app.state, category }
    })
  }

  const setCollection = (collection: string) => {
    setState(() => {
      return { ...app.state, collection }
    })
  }

  const setNewCollection = (newCollection: string) => {
    setState(() => {
      return { ...app.state, newCollection }
    })
  }
  const setBookmarks = (bookmarks: Bookmark[]) => {
    setState(() => {
      return { ...app.state, bookmarks }
    })
  }


  const setNftmarks = (nftmarks: Nftmark[]) => {
    setState(() => {
      return { ...app.state, nftmarks }
    })
  }

  const setMarksView = (view: string) => {
    setState(() => {
      return { ...app.state, marksView: view }
    })
  }

  const setMarkToMint = (nftmark: Nftmark) => {
    setState(() => {
      return { ...app.state, markToMint: nftmark }
    })
  }

  const setNewCollectionParentId = (id: number) => {
    setState(() => {
      return {
        ...app.state, newCollectionParentId
          : id
      }
    })
  }

  const setConfirmedAction = (confirmation: any) => {
    setState(() => {
      return {
        ...app.state,
        confirmedAction: confirmation
      }
    })
  }
  // const setLoading = app.setLoading;

  return {
    setCategory,
    nftmarks,
    setBookmarks,
    setNftmarks,
    addBookmark,
    setLoading,
    bookmarks,
    loading,
    setMarksView,
    marksView,
    collection,
    setCollection,
    setMarkToMint,
    nftmarkName,
    nftCategory,
    markToMint,
    setBookmarkChecked,
    setAllBookmarksChecked,
    deleteBookmarks,
    setMarkToMintAndNavToMintPage,
    getUserBookmarks,
    search,
    setSearch,
    checkedBookmarks,
    startView,
    collections,
    setNewCollection,
    newCollection,
    getUserCollections,
    deleteCollection,
    setNewCollectionParentId,
    newCollectionParentId,
    syncBookmarksFromBrowser,
    syncDatabaseToBrowser,
    confirmedAction,
    setConfirmedAction,
    resetBookmarksChecked
  };
};

export default useContent;
