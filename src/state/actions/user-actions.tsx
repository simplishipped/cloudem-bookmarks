import { useSelector } from "../../store";
import { ethers } from "ethers";
import supabase from "../../api/supabase";
const provider = new ethers.BrowserProvider((window as any).ethereum);


const useUser = () => {
  const { app } = useSelector();
  const user = () => app.state.user;
  const setState = app.setState;
  const authed = () => app.state.authed;

  const setUser = (user: any) => {
    setState(() => {
      return { ...app.state, user }
    })
  }

  const setAuthed = (authed: boolean) => {
    setState(() => {
      return { ...app.state, authed }
    })
  }

  const identifyUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data && data.user) {

      let { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.user.email);

      if (users && users.length > 0) {
        const user = users[0];
        if (user.blockchain_enabled) {
          const accounts = await provider.send('eth_accounts', []);
          setState(() => {
            return { ...app.state, user, authed: true, blockchainEnabled: true }
          })
          if (accounts.length > 0) {
            setState(() => {
              return { ...app.state, user, connectedToBlockchain: true }
            })
          } else {
            setState(() => {
              return { ...app.state, user, authed: true }
            })
            const accounts = await provider.send("eth_requestAccounts", []);
            try {
              if (accounts.length > 0) {
                setState(() => {
                  return { ...app.state, user, connectedToBlockchain: true, blockchainEnabled: true }
                })
              } else {
                //@ts-ignore
                setState(() => {
                  return { ...app.state, user, connectedToBlockchain: false, blockchainEnabled: true }
                })
              }
            } catch (err) {
              //@ts-ignore
              setState(() => {
                return { ...app.state, user, connectedToBlockchain: false, blockchainEnabled: true }
              })
            }

          }

        } else {
          setState(() => {
            return { ...app.state, user, connectedToBlockchain: false, authed: true, blockchainEnabled: false }
          })
        }
      } else {
        //@ts-ignore
        setState(() => {
          return { ...app.state, failed: { ...app.state.failed, login: 'Something went wrong.' }, connectedToBlockchain: false, authed: false }
        })
      }
    } else {
      const accounts = await provider.send('eth_accounts', []);
      if (accounts.length > 0) {
        let { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('walletaddr_arb', accounts[0]);
        if (users && users.length > 0) {
          const user = users[0];
          setState(() => {
            return { ...app.state, user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
          })
        }
      }
    }
  }

  const connect = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        let { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('walletaddr_arb', accounts[0]);

        if (users && users.length > 0) {
          setState(() => {
            return { ...app.state, user: users[0], connectedToBlockchain: true, blockchainEnabled: true, authed: true }
          })
          setUser(users[0]);
        } else {
          const { data, error } = await supabase
            .from('users')
            .insert([{ walletaddr_arb: accounts[0] }])
            .select();
          if (data) {
            setState(() => {
              //@ts-ignore
              return { ...app.state, user: data.users[0], connectedToBlockchain: true, blockchainEnabled: true, authed: true }
            })
          } else {
            // setError('Failed to save user to database');
          }
        }

     
      } catch (err) {
        // setError('Please install crypto wallet');
      }
    }
  }

  

  return {
    user,
    setUser,
    identifyUser,
    authed,
    connect,
    setAuthed
  };
};

export default useUser;
