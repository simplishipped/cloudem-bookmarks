import { createStore } from "solid-js/store";
import { Bookmark, Nftmark } from '../components/molecules/types';
import nftMarksApi from "../api/bookmarks-api";
import { User } from "../components/organisms/types";
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


let user: User = {
  email:'',
  blockchain_enabled: false,
  id: null
}
let landingView: boolean = true;
let nftmarkName: string = '';
let nftmarks: Nftmark[] = [];
let bookmarks: Bookmark[] = [];
let nftCategory: string = 'Default';
let collection: string = 'Crypto';
let globalLoader: boolean = false;
let chainName: string = 'ethereum';
let connectedToBlockchain: boolean = false;
let blockchainEnabled: boolean = false;
let authed: boolean = false;
let search: string = '';
let checkedBookmarks: number[] = [] // has ids of all bookmarks to delete

const [state, setState] = createStore({
  user,
  theme,
  nftmarks,
  nftmarkName,
  bookmarks,
  nftCategory,
  collection,
  // blockchain,
  landingView,
  failed: {
    nftmarks: null,
    bookmarks: null,
    mint: null,
    login: null
  },
  loading: {
    nftmarks: null,
    bookmarks: null,
    mint: null
  },
  marksView: 'collections',
  markToMint: {},
  globalLoader,
  chainName,
  connectedToBlockchain,
  blockchainEnabled,
  authed,
  search,
  checkedBookmarks
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
