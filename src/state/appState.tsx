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

interface Blockchain {
  connected: boolean
  chain: string
}

let user: User = {
  email:'',
  blockchain_enabled: false
}
let landingView: boolean = true;
let nftmarkName: string = '';
let nftmarks: Nftmark[] = [];
let bookmarks: Bookmark[] = [];
let nft_category: string = 'Default';
let collection: string = 'Crypto';
let bookmarksChecked: boolean = false;
let blockchain: Blockchain = {
  connected: false,
  chain: 'ethereum'
}

const [state, setState] = createStore({
  user,
  theme,
  nftmarks,
  nftmarkName,
  bookmarks,
  nft_category,
  collection,
  blockchain,
  landingView,
  failed: {
    nftmarks: null,
    bookmarks: null,
    mint: null
  },
  loading: {
    nftmarks: null,
    bookmarks: null,
    mint: null
  },
  marksView: 'collections',
  markToMint: {},
  bookmarksChecked
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

  const setBlockchain = (chain: string) => {
    setState(() => {
      return {
        ...state, blockchain: { ...state.blockchain, chain }
      }
    })
  }

  return { state, setState, setTheme, setBlockchain };
};
