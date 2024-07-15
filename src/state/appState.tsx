import { createStore } from "solid-js/store";
import { Bookmark, Nftmark, Collection  } from "../types/types";
let theme: boolean = true;

if ("theme" in localStorage) {
  let savedTheme = localStorage.getItem("theme");
  theme = savedTheme === "dark" ? true : false;
  if (theme) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}



let userUpdate: any = {}
let user: any = {}
let errorRetries: number = 3;
let startView: boolean = true;
let nftmarkName: string = '';
let nftmarks: Nftmark[] = [];
let bookmarks: Bookmark[] = [];
let nftCategory: string = 'Default';
let collection: Collection
let newCollectionParentId: number | undefined;
let newCollection: Collection;
let globalLoader: boolean = false;
let chainName: string = 'ethereum';
let connectedToBlockchain: boolean = false;
let blockchainEnabled: boolean = false;
let authed: boolean = false;
let search: string = '';
let checkedBookmarks: number[] = [] // has ids of all bookmarks to delete
let initRender: boolean = false;
let collections: Collection[] = [];
let initCollections: Collection[] = [];
let confirmedAction: any = false;
let confirmationsEnabled: boolean = true;
let mainCollection: Collection;
let tempBookmarksEnabled: boolean = false;


const [state, setState] = createStore({
  user,
  theme,
  nftmarks,
  nftmarkName,
  bookmarks,
  nftCategory,
  //@ts-ignore
  collection,
  // blockchain,
  startView,
  loading: {
    nftmarks: null,
    bookmarks: null,
    mint: null,
    collections: null,
    user: true,
  },
  marksView: 'collections',
  markToMint: {},
  globalLoader,
  chainName,
  connectedToBlockchain,
  blockchainEnabled,
  authed,
  search,
  checkedBookmarks,
  initRender,
  collections,
  initCollections,
  //@ts-ignore
  newCollection,
  errorRetries,
  error: {
    settingsError: null,
    globalError: null,
    addBookmarkError: null,
    homeError: null
  },
  notification: {
    settingsNotification: null,
    globalNotification: null,
    addBookmarkNotification: null,
    homeNotification: null
  },
  newCollectionParentId,
  confirmedAction,
  confirmationsEnabled,
  //@ts-ignore
  mainCollection,
  tempBookmarksEnabled
});

export const useAppState = () => {
  const setTheme = (theme: boolean) => {
    setState(() => {
      if (theme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme ? "dark" : "light");
      return { ...state, theme };
    });
  };



  return { state, setState, setTheme };
};
