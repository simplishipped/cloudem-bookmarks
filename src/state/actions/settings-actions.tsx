import { useSelector } from "../../store";
import supabase from "../../api/supabase";
import { ethers } from 'ethers';
import userApi from "../../api/user-api";
import bookmarksApi from "../../api/bookmarks-api";
const provider = new ethers.BrowserProvider((window as any).ethereum);


const useSettings = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const blockchain = () => app.state.chainName;
  const connectedToBlockchain = () => app.state.connectedToBlockchain;
  const startView = () => app.state.startView;
  const blockchainEnabled = () => app.state.blockchainEnabled;

  const enableBlockchain = async () => {
    if (!blockchainEnabled()) {
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
              ...app.state, connectedToBlockchain: true, blockchainEnabled: true, chainName: network.name, globalLoader: false
            }
          })
        } else {

        }

      } else {
      }
    } else {
      //@ts-ignore
      disableBlockchain(app.state.user.id)
    }

  }

  const disableBlockchain = async (userId: number) => {

    //@ts-ignore
    const done = await userApi.disableBlockchain(userId);
    if (done) {
      setState(() => {
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

  const setStartView = async (startView: boolean) => {
    //@ts-ignore
    const data = await userApi.updateUser(app.state.user.id, { start_view: startView });
    if(data) {
      setState(() => {
        return {
          ...app.state, startView, 
        }
      })
    }

  }


  const exportBookmarks = async () => {
    try {
      //@ts-ignore
      let bookmarks = await bookmarksApi.getBookmarksByUser(app.state.user.id);
      var fileToSave = new Blob([JSON.stringify(bookmarks)], {
        type: 'application/json'
      });

      const a = document.createElement('a');
      const type = 'application/json'
      a.href = URL.createObjectURL(fileToSave);
      a.download = 'bookmarks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.log(err);
    }
  }


  return {
    setConnected,
    blockchain,
    startView,
    setStartView,
    enableBlockchain,
    connectedToBlockchain,
    blockchainEnabled,
    disableBlockchain,
    exportBookmarks
  };
};

export default useSettings;
