import { Nftmark } from "../components/molecules/types"
import supabase from "./supabase";
import axios from 'axios';

export const mintCollectionToNft = async (nftmark: Nftmark) => {
  const { data, error } = await supabase.from('nftmarks').insert(nftmark);
  if (data) {
    return data
  } else {
    return false;
  }
}

export const getNftmarks = async () => {

}

export const getNftmarksByUser = async (userId: string) => {

}


// export default {
//   mintCollectionToNft,
//   // getNftmarksByUser,
//   // getNftmarks
// }