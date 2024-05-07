import { useSelector } from "../../store";
import nftmarksApi from "../../api/nftmarks-api";
import { Bookmark, Nftmark } from "../../components/molecules/types";
import bookmarksApi from "../../api/bookmarks-api";

const useContent = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const nftmarks = () => app.state.nftmarks;
  const category = () => app.state.category
  const bookmarks = () => app.state.bookmarks;
  const loading = () => app.state.loading;
  const marksView = () => app.state.marksView;
  const collection = () => app.state.collection;
  const collections = () => app.state.collections;
  const markToMint = () => app.state.markToMint;

  const setLoading = (type: string, bool: Boolean) => {
    setState(() => {
      return { ...app.state, loading: {...app.state.loading, [type]: bool } }    
    })
  }
  const addBookmark = async (bookmark: Bookmark, type: string) => {
    try {
      const response = await bookmarksApi.addBookmark(bookmark);
      if(type === 'collections') {
        console.log(bookmark)
        setState(() => {
          return {...app.state, collections: [bookmark, ...app.state.collections]}
        })
      } else {
        setState(() => {
          return { ...app.state, bookmarks: [bookmark, ...app.state.bookmarks] }
        })
      }
 
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
  
  const setBookmarks = (bookmarks: Bookmark[]) => {
    setState(() => {
      return { ...app.state, bookmarks }
    })
  }

    
  const setCollections = (collections: Bookmark[]) => {
    setState(() => {
      return { ...app.state, collections }
    })
  }


  const setNftmarks = (nftmarks: Nftmark[]) => {
    setState(() => {
      return { ...app.state, nftmarks }
    })
  }

  const setMarksView = (view: string) => {
    setState(() => {
      return {...app.state, marksView: view}
    })
  }

  const setMarkToMint = (nftmark: Nftmark) => {
    setState(() => {
      return {...app.state, markToMint: nftmark}
    })
  }

  // const setLoading = app.setLoading;


  return {
    category,
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
    collections,
    setCollection,
    setCollections,
    setMarkToMint
  };
};

export default useContent;
