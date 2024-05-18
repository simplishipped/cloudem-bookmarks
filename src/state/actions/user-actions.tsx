import { useSelector } from "../../store";
import { ethers } from "ethers";
import userApi, { getUSerByWalletAddr } from "../../api/user-api";
const provider = new ethers.BrowserProvider((window as any).ethereum);


const useUser = () => {
  const { app } = useSelector();
  const user = () => app.state.user;
  const setState = app.setState;
  const authed = () => app.state.authed;
  const initRender = () => app.state.initRender;


  const setInitRender = (bool: boolean) => {
    setState(() => {
      return { ...app.state, initRender: bool }
    })
  }


  const updateUser = async (user: any) => {
    const data = await userApi.updateUser(user.id, user);
    if (data) {
      return data
    } else {
      return false;
    }
  }

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

  const setStartView = (startView: boolean) => {
    setState(() => {
      return { ...app.state, startView }
    })
  }

  const identifyUser = async () => {
    const data = await userApi.getAuth()
    if (data && data.user && data.user.email) {

      let user = await userApi.getUser(data.user.email)

      if (user) {
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
        setStartView(user.start_view);
      } else {
        //@ts-ignore
        setState(() => {
          return { ...app.state, failed: { ...app.state.failed, login: 'Something went wrong.' }, connectedToBlockchain: false, authed: false }
        })
      }
    } else {
      const accounts = await provider.send('eth_accounts', []);
      if (accounts.length > 0) {
        const user = await userApi.getUser(accounts[0])

        if (user) {
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
        const user = await getUSerByWalletAddr(accounts[0])


        if (user) {
          setState(() => {
            return { ...app.state, user: user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
          })
          setUser(user);
        } else {
          const user = await userApi.createUser(accounts[0])

          if (user) {
            setState(() => {
              //@ts-ignore
              return { ...app.state, user: data.user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
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
    setAuthed,
    updateUser,
    initRender,
    setInitRender
    
  };
};

export default useUser;
