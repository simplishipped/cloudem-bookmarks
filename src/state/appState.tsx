import { createStore } from "solid-js/store";
import { Bookmark, Nftmark } from '../components/molecules/types';
import nftMarksApi from "../api/bookmarks-api";
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

let nftmarks: Nftmark[] = [];
let bookmarks: Bookmark[] = [];
let collections: Bookmark[] = [];
let category: string = 'Default';
let collection: string = 'Inception';
let blockchain: Blockchain = {
  connected: false,
  chain: 'ethereum'
}

const [state, setState] = createStore({
  theme,
  nftmarks,
  bookmarks,
  collections,
  category,
  collection,
  blockchain,
  failed: {
    nftmarks: null,
    bookmarks: null
  },
  loading: {
    nftmarks: null,
    bookmarks: null
  },
  marksView: 'categories',
  markToMint: {}
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
