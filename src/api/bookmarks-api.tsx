import { Bookmark, Nftmark } from "../types/types"
import supabase from "./supabase";
// const url = 'http://localhost:9000/bookmark';


const addBookmark = async (bookmark: Bookmark) => {
  const { data, error }  = await supabase.from('bookmarks').insert(bookmark).select('*');
  return data ? { data: data[0] } : { error };
}

const deleteBookmarks = async (ids: number[]) => {
  const { data, error }  = await supabase.from('bookmarks').delete().in('id', ids);
  return data ? { data } : { error };
}

const getBookmarks = async () => {
  const { data, error } = await supabase.from('bookmarks').select('*').eq('id', 1);
  return data ? { data: data } : { error };
}

const getBookmarksByUser = async (userId: number) => {
  const { data, error }  = await supabase.from('bookmarks').select('*').eq('user_id', userId);
  return data ? { data: data } : { error };
}

const getCollectionsByUser = async (userId: number) => {
  const { data, error }  = await supabase.from('collections').select('*').eq('user_id', userId);
  return data ? { data: data } : { error };
}

const createCollection = async (name: string, userId: number) => { 
  const { data, error }  = await supabase.from('collections').insert({ name, user_id: userId }).select('*');
  return data ? { data: data[0] } : { error };
}

const deleteCollection = async (id: number) => {
  const { data, error }  = await supabase.from('collections').delete().eq('id', id);
  return data ? { data: data } : { error };
}

export default {
  addBookmark,
  getBookmarksByUser,
  getBookmarks,
  deleteBookmarks,
  getCollectionsByUser,
  createCollection,
  deleteCollection
}