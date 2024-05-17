import { Bookmark } from "../components/molecules/types"
import {Nftmark} from "../components/molecules/types";
import axios from 'axios';
import supabase from "./supabase";
// const url = 'http://localhost:9000/bookmark';


const addBookmark = async (bookmark: Bookmark) => {
  const { data, error }  = await supabase.from('bookmarks').insert(bookmark).select('*');;
  if(data) {
    return data[0]
  } else { 
    return false;
  }
}

const deleteBookmarks = async (ids: number[]) => {
  const { data, error }  = await supabase.from('bookmarks').delete().in('id', ids);
  if(data) {
    return data;
  } else {
    return false;
  }
}

const getBookmarks = async () => {
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
  getBookmarks,
  deleteBookmarks
}