import supabase from "../api/supabase"
import { ethers } from "ethers";
import useContent from "../state/actions/content-actions";
const provider = new ethers.BrowserProvider((window as any).ethereum);


const identifyUser = async () => {

  const { setUser, user, globalLoader, setGlobalLoader } = useContent();

  if ((window as any).ethereum) {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
     
      } catch (err) {
      
    }
  }
}