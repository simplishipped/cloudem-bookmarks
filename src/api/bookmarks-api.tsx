import { Bookmark, Collection, Nftmark } from "../types/types"
import supabase from "./supabase";
// const url = 'http://localhost:9000/bookmark';


const addBookmark = async (bookmark: Bookmark) => {
  const user_id = bookmark.user_id;
  const { data, error } = await supabase.from('bookmarks').insert(bookmark).select('*');
  if (data) {
    const bookmarks = await supabase.rpc('get_decrypted_bookmarks', {
      user_id_param: user_id,
    })
    let decrypted = bookmarks.data.find((b: any) => b.id === data[0].id);
    // const decrypted = await supabase.from('decrypted_bookmarks').select("*").eq('user_id', user_id).eq('id', data[0].id).single();
    return bookmarks.data ? { data: decrypted } : { error: bookmarks.error };
  } else {
    return { error };
  }
}

const addBookmarks = async (bookmarks: Bookmark[]) => {
  const { data, error } = await supabase.from('bookmarks').insert(bookmarks).select('*');
  const user_id = bookmarks[0].user_id;
  if (data) {
    const decrypted = await supabase.rpc('get_decrypted_bookmarks', {
      user_id_param: user_id,
    })
    const onlyTheOnesAdded = decrypted.data.filter((b: Bookmark) => {
      return data.find((d: Bookmark) => d.id === b.id);
    })
    return decrypted.data ? { data: onlyTheOnesAdded } : { error: decrypted.error };
  } else {
    return { error };
  }
}

const deleteBookmarks = async (ids: number[]) => {
  const { data, error } = await supabase.from('bookmarks').delete().in('id', ids);
  return data ? { data } : { error };
}


const getBookmarksByUser = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_decrypted_bookmarks', {
    user_id_param: userId,
  })
  return data ? { data: data } : { error };
}

const getCollectionsByUser = async (userId: string) => {
  const { data, error } = await supabase.from('collections').select('*').eq('user_id', userId);
  return data ? { data: data } : { error };
}

const getCollectionsByUserWalletAddr = async (walletaddr: string) => {
  const { data, error } = await supabase.from('collections').select('*').eq('walletaddr_arb', walletaddr);
  return data ? { data: data } : { error };
}

const createCollection = async (collection: Collection) => {
  const { data, error } = await supabase.from('collections').insert(collection).select('*');
  return data ? { data: data[0] } : { error };
}


const createCollections = async (collections: any) => {
  const { data, error } = await supabase.from('collections').insert(collections).select('*');
  return data ? { data: data } : { error };
}


const deleteCollection = async (id: number) => {
  const { data, error } = await supabase.from('collections').delete().eq('id', id);
  return !error ? { data: data } : { error };
}

export default {
  addBookmark,
  getBookmarksByUser,
  deleteBookmarks,
  getCollectionsByUser,
  createCollection,
  deleteCollection,
  getCollectionsByUserWalletAddr,
  addBookmarks,
  createCollections
}