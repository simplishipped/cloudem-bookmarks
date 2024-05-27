import { useSelector } from "../../store";
import { Bookmark, Nftmark } from "../../types/types";
import bookmarksApi from "../../api/bookmarks-api";
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
      //@ts-ignore
      const exists = collections.find(c => c.name.toLowerCase() === bookmark.collection.toLowerCase());
      if (!exists) {
        const data = await bookmarksApi.createCollection(bookmark.collection, bookmark.user_id);
        if (data) {
          const bk = await bookmarksApi.addBookmark(bookmark);
          setState(() => {
            return {
              ...app.state, bookmarks: [bk, ...app.state.bookmarks], collections: [data, ...app.state.collections],
              collection: bookmark.collection
            }
          })
        } else {
          console.log('')
        }

      } else {
        const bk = await bookmarksApi.addBookmark(bookmark);
        setState(() => {
          return { ...app.state, bookmarks: [bk, ...app.state.bookmarks] }
        })

      }


    } catch (err) {

    }
  }

  const deleteBookmarks = async () => {
    try {
      if (app.state.checkedBookmarks.length > 0) {
        // @ts-ignore
        await bookmarksApi.deleteBookmarks(app.state.checkedBookmarks);
      }
      setState(() => {
        return { ...app.state, bookmarks: app.state.bookmarks.filter(b => !app.state.checkedBookmarks.includes(b.id)), checkedBookmarks: [] }
      })
    } catch (err) {

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
    if (bookmarks().length === 0) {
      setLoading('bookmarks', true);
      const marks = await bookmarksApi.getBookmarksByUser(1);
      setLoading('bookmarks', false);
      if (marks) {
        setState(() => {
          return { ...app.state, bookmarks: marks }
        })
      }
    }
  }

  const getUserCollections = async () => {
    if (collections().length === 0) {
      setLoading('collections', true);
      const collections = await bookmarksApi.getCollectionsByUser(user().id);
      setLoading('collections', false);
      if (collections) {
        setState(() => {
          return { ...app.state, collections }
        })
      }
    }
  }

  const deleteCollection = async (collection: any) => {
    try {
      await bookmarksApi.deleteCollection(collection.id);
      setState(() => {
        return { ...app.state, collections: app.state.collections.filter(c => c.name !== collection.name) }
      })
    } catch (err) {

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
