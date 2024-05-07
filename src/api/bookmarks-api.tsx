import { Bookmark } from "../components/molecules/types"
import {Nftmark} from "../components/molecules/types";
import axios from 'axios';
const url = 'http://localhost:9000/bookmark';


const addBookmark = async (bookmark: Bookmark) => {
  const response = await axios.post(url, bookmark);
  return response;
}

const getBookmarks = async () => {
  const response = await axios.post(url);
  return response.data;
}

const getBookmarksByUser = async (userId: string) => {
  const response = await axios.get(url+'s/user', { params: { userId } });
  return response.data;
}


export default {
  addBookmark,
  getBookmarksByUser,
  getBookmarks
}