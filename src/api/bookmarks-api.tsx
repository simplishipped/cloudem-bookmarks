import { Bookmark } from "../components/molecules/types"
import {Nftmark} from "../components/molecules/types";
import axios from 'axios';
import supabase from "./supabase";
const url = 'http://localhost:9000/bookmark';


const addBookmark = async (bookmark: Bookmark) => {
  const response = await axios.post(url, bookmark);
  return response;
}

const getBookmarks = async () => {
  console.log('yo')
  const response = await supabase.from('bookmarks').select('*').eq('id', 1);
  console.log(response)
}

const getBookmarksByUser = async (userId: number) => {
  const { data, error }  = await supabase.from('bookmarks').select('*').eq('user_id', userId);
  if(data) {
    return data;
  } else {
    return false;
  }

}


export default {
  addBookmark,
  getBookmarksByUser,
  getBookmarks
}