import { Nftmark } from "../components/molecules/types"
import axios from 'axios';
const url = 'http://localhost:9000/nftmarks';

const addNftmark = async (nftmark: Nftmark) => {
  const response = await axios.post(url, nftmark);
  return response;
}

const getNftmarks = async () => {
  const response = await axios.get(url);
  return response.data;
}

const getNftmarksByUser = async (userId: string) => {
  const response = await axios.get(url+'s/user', { params: { userId } });
  return response.data;
}


export default {
  addNftmark,
  getNftmarksByUser,
  getNftmarks
}