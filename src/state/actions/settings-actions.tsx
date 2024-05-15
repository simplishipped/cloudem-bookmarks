import { useSelector } from "../../store";
import supabase from "../../api/supabase";
import { ethers } from 'ethers';
import userApi from "../../api/user-api";
const provider = new ethers.BrowserProvider((window as any).ethereum);


const useSettings = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const blockchain = () => app.state.chainName;
  const connectedToBlockchain = () => app.state.connectedToBlockchain;
  const landingView = () => app.state.landingView;
  const blockchainEnabled = () => app.state.blockchainEnabled;

  const enableBlockchain = async () => {
    if(!blockchainEnabled()) {
      setState(() => {
        return {
          ...app.state, globalLoader: true
        }
      })
  
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
  
      if (accounts.length > 0) {
        const { data } = await supabase.auth.getUser();
        const res = await supabase.from('users').update({ 'blockchain_enabled': true, walletaddr_arb: accounts[0] }).eq('email', data.user?.email).select();
        //@ts-ignore
        if (!res.error) {
          //@ts-ignore
          setState(() => {
            return {
              ...app.state, connectedToBlockchain: true, blockchainEnabled: true,  chainName: network.name, globalLoader: false
            }
          })
        } else {
  
        }
  
      } else {
      }
    } else {
      console.log(app.state.user)

      //@ts-ignore
      disableBlockchain(app.state.user.id)
    }

  }

  const disableBlockchain = async (userId: number) => {
    
    console.log('huh', userId)
        //@ts-ignore

    const done = await userApi.disableBlockchain(userId);
    console.log('haj', done)
    if (done) {
      console.log('brier')
      setState(() => {
        console.log('bruh')
        return {
          ...app.state, blockchainEnabled: false, connectedToBlockchain: false
        }
      })
    } else {
      setState(() => {
        return {
          ...app.state
        }
      })
    }



  }

  const setConnected = (connected: boolean) => {
    setState(() => {
      return {
        ...app.state, connectedToBlockchain: connected
      }
    })
  }

  const setLandingView = (landingView: boolean) => {
    setState(() => {
      return {
        ...app.state, landingView
      }
    })
  }

  return {
    setConnected,
    blockchain,
    landingView,
    setLandingView,
    enableBlockchain,
    connectedToBlockchain,
    blockchainEnabled,
    disableBlockchain
  };
};

export default useSettings;
