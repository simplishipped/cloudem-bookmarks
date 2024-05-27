import { useSelector } from "../../store";
import { Bookmark, Nftmark } from "../../types/types";
import bookmarksApi from "../../api/bookmarks-api";
import log from "../../util/logger";
import useCommon from "./common-actions";
import capitalizeFirstLetter from "../../util/capitalize-word";

const useContent = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const nftmarks = () => app.state.nftmarks;
  const bookmarks = () => app.state.bookmarks;
  const loading = () => app.state.loading;
  const marksView = () => app.state.marksView;
  const collection = () => app.state.collection;
  const collections = () => app.state.collections;
  const markToMint = () => app.state.markToMint;
  const nftmarkName = () => app.state.nftmarkName;
  const nftCategory = () => app.state.nftCategory;
  const failed = () => app.state.failed;
  const globalLoader = () => app.state.globalLoader;
  const search = () => app.state.search;
  const checkedBookmarks = () => app.state.checkedBookmarks;
  const startView = () => app.state.startView;
  const newCollection = () => app.state.newCollection;
  const user = () => app.state.user

  const common = useCommon();

  const setSearch = (search: string) => {
    setState(() => {
      return { ...app.state, search }
    })
  }

  const setGlobalLoader = (bool: boolean) => {
    setState(() => {
      return { ...app.state, globalLoader: bool }
    })
  }

  const setBookmarkChecked = (id: number, bool: boolean, row: any) => {
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

  const setLoadFailed = (type: string, bool: Boolean) => {
    setState(() => {
      return { ...app.state, failed: { ...app.state.failed, [type]: bool } }
    })
  }

  const addBookmark = async (bookmark: Bookmark) => {
    try {
      const collections = await bookmarksApi.getCollectionsByUser(bookmark.user_id);
      let exists = false;
      if (collections.data) {
        //@ts-ignore
        exists = collections.data.find(c => c.name.toLowerCase() === bookmark.collection.toLowerCase());
      }
      if (!exists) {
        const newCollection = await bookmarksApi.createCollection(bookmark.collection, bookmark.user_id);
        if (newCollection.data) {
          const bk = await bookmarksApi.addBookmark(bookmark);
          if (bk.data) {
            setState(() => {
              return {
                ...app.state, bookmarks: [bk.data, ...app.state.bookmarks], collections: [newCollection.data, ...app.state.collections],
                collection: bookmark.collection
              }
            })
          } else {
            common.setError('Failed to add bookmark', 'addBookmarkError');
            log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-1' });
          }

        } else {
          common.setError('Failed to add bookmark', 'addBookmarkError');
          log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-2' });
        }

      } else {
        const bk = await bookmarksApi.addBookmark(bookmark);
        if (bk.data) {
          setState(() => {
            return { ...app.state, bookmarks: [bk.data, ...app.state.bookmarks], collection: bk.data.collection }
          })
        } else {
          common.setError('Failed to add bookmark', 'addBookmarkError');
          log.error({ function: 'addBookmark', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-3' });
        }
      }


    } catch (error) {
      common.setError('Failed to add bookmark', 'addBookmarkError');
      log.error({ function: 'addBookmark', error: error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-4' });

    }
  }

  const deleteBookmarks = async () => {
    try {
      if (app.state.checkedBookmarks.length > 0) {
        // @ts-ignore
        const res = await bookmarksApi.deleteBookmarks(app.state.checkedBookmarks);
        if (!res.error) {
          setState(() => {
            return { ...app.state, bookmarks: app.state.bookmarks.filter(b => !app.state.checkedBookmarks.includes(b.id)), checkedBookmarks: [] }
          })
        } else {
          common.setError('Failed to delete bookmark', 'deleteBookmarkError');
          log.error({ function: 'deleteBookmarks', error: res.error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-5' });
        }
      }

    } catch (error) {
      common.setError('Failed to delete bookmark', 'deleteBookmarkError');
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
        const marks = await bookmarksApi.getBookmarksByUser(1);
        setLoading('bookmarks', false);
        if (marks.data) {
          setState(() => {
            return { ...app.state, bookmarks: marks.data }
          })
        } else {
          common.setError('Failed to fetch user bookmarks', 'getUserBookmarksError');
          log.error({ function: 'getUserBookmarks', error: 'Failed to fetch bookmarks', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-6' });
        }
      }
    } catch (error) {
      common.setError('Failed to fetch user bookmarks', 'getUserBookmarksError');
      log.error({ function: 'getUserBookmarks', error: 'Failed to fetch bookmarks', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-7' });
    }
  }

  const getUserCollections = async () => {
    if (collections().length === 0) {
      setLoading('collections', true);
      const collections = await bookmarksApi.getCollectionsByUser(user().id);
      setLoading('collections', false);
      if (collections.data) {
        setState(() => {
          return { ...app.state, collections: collections.data }
        })
      } else {
        common.setError('Failed get user collections', 'getUserCollectionsError');
        log.error({ function: 'getUserCollections', error: 'Failed to fetch collections', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-8' });
      }
    }
  }

  const deleteCollection = async (collection: any) => {
    try {
      const res = await bookmarksApi.deleteCollection(collection.id);
      if (res.data) {
        setState(() => {
          return { ...app.state, collections: app.state.collections.filter(c => c.name !== collection.name) }
        })
      } else {
        common.setError('Failed to delete collection', 'deleteCollectionError');
        log.error({ function: 'deleteCollection', error: '', user_id: user().id, timestamp: new Date(), log_id: 'content-actions-9' });
      }
    } catch (error) {
      common.setError('Failed to delete collection', 'deleteCollectionError');
      log.error({ function: 'deleteCollection', error: error, user_id: user().id, timestamp: new Date(), log_id: 'content-actions-10' });
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
    setLoadFailed,
    failed,
    setBookmarkChecked,
    setAllBookmarksChecked,
    deleteBookmarks,
    globalLoader,
    setGlobalLoader,
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
    deleteCollection

  };
};

export default useContent;
