import { useSelector } from "../../store";
import { ethers } from "ethers";
import userApi, { getUserByWalletAddr } from "../../api/user-api";
import useCommon from "./common-actions";
import { User } from "../../types/types";
import log from "../../util/logger";

const provider = new ethers.BrowserProvider((window as any).ethereum);


const useUser = () => {
  const { app } = useSelector();
  const user = () => app.state.user;
  const setState = app.setState;
  const authed = () => app.state.authed;
  const initRender = () => app.state.initRender;
  const common = useCommon();


  const setInitRender = (bool: boolean) => {
    setState(() => {
      return { ...app.state, initRender: bool }
    })
  }


  const updateUser = async (user: any) => {
    try {
      const { data, error } = await userApi.updateUser(user.id, user);
      if (data) {
        setState(() => {
          return { ...app.state, user: data }
        })
      } else {
        log.error({ function: 'updateUser', error: error.message, user_id: user.id, timestamp: new Date(), log_id: 'user-actions-1' });
        common.setError('Error updating user.', 'globalError');
      }
    } catch (error: any) {
      log.error({ function: 'updateUser', error: error.message, user_id: user.id, timestamp: new Date(), log_id: 'user-actions-2' })
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

  const identifyUser = async (user: any) => {
    try {
      if (!user) {
        let auth = await userApi.getAuth();
        user = auth.data;
      }
      if (user && user.email) {
        let userRes = await userApi.getUser(user.email);

        if (userRes && userRes.data) {
          user = userRes.data;
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
              } catch (error) {
                log.error({ function: 'identifyUser', error, user_id: user.id, user_email: user.email, timestamp: new Date(), log_id: 'user-actions-3' });
                common.setError('Error identifying user.', 'globalError');

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
          log.error({ function: 'identifyUser', error: 'No user data returned', user_id: user.id, user_email: user.email, timestamp: new Date(), log_id: 'user-actions-4' });
          common.setError('Error identifying user.', 'globalError');

          //@ts-ignore
          setState(() => {
            return { ...app.state, connectedToBlockchain: false, authed: false }
          })
        }
      } else {
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          const user = await userApi.getUserByWalletAddr(accounts[0])
          if(user.data && user.data.blockchain_enabled) {
            setState(() => {
              return { ...app.state, user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
            })
          } else {
            if (user) {
              setState(() => {
                return { ...app.state, user, connectedToBlockchain: false, blockchainEnabled: false, authed: true }
              })
            }
          }  
        }
      }
    } catch (error: any) {
      log.error({ function: 'identifyUser', error: error.message, user_id: user.id, user_email: user.email, timestamp: new Date(), log_id: 'user-actions-6' });
      common.setError('Error identifying user.', 'globalError');

    }
  }


  const connect = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        const user = await getUserByWalletAddr(accounts[0])


        if (user.data) {
          setState(() => {
            return { ...app.state, user: user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
          })
          setUser(user);
        } else if (accounts[0]) {
          const user = await userApi.createUser(accounts[0]);

          if (user) {
            setState(() => {
              //@ts-ignore
              return { ...app.state, user: data.user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
            })
          } else {
            log.error({ function: 'connect', error: 'Failed to save walletaddr as user', walletaddr_arb: accounts[0], timestamp: new Date(), log_id: 'user-actions-7' })
            common.setError('Failed to save user to database', 'globalError');
          }
        }


      } catch (error) {
        // setError('Please install crypto wallet');
        log.error({ function: 'connect', error: error, timestamp: new Date(), log_id: 'user-actions-7' });
        common.setError('Error updating user.', 'globalError');
      }
    }
  }



  async function signUpNewUser(email: string, password: string, confirmPassword: string) {
    try {
      if (email && password && confirmPassword) {
        if (password === confirmPassword) {
          common.setGlobalLoader(true);

          const { data, error } = await userApi.signUpUser(email, password);
          if (data) {
            const createUserRes = await userApi.createUser({ email });
            if (createUserRes.data) {
              setState(() => {
                return { ...app.state, user, authed: false, blockchainEnabled: false, connectedToBlockchain: false }
              })
            } else {
              log.error({ function: 'signUpNewUser', error: createUserRes.error, user_email: email, timestamp: new Date(), log_id: 'user-actions-8' })
              common.setError('Failed to sign up with email', 'globalError');
            }
          } else {
            log.error({ function: 'signUpNewUser', error: error, user_email: email, timestamp: new Date(), log_id: 'user-actions-9' })
            common.setError('Failed to sign up with email', 'globalError');
          }
        } else {
          common.setError('Passwords do not match', 'globalError');
        }
        common.setGlobalLoader(false)

      }
    } catch (error: any) {
      log.error({ function: 'signUpNewUser', error: error.message, user_email: email, timestamp: new Date(), log_id: 'user-actions-10' });
      common.setError('Error updating user.', 'globalError');

    }

  }


  async function signInWithEmail(email: string, password: string) {
    try {
      if (email && password) {
        common.setGlobalLoader(true);
        const user = await userApi.signInUser(email, password);
        if (user.data) {
          await identifyUser(user.data)
        } else {
          common.setError('Credentials are incorrect', 'globalError');
        }
        common.setGlobalLoader(false)
      }
    } catch (error) {
      log.error({ function: 'signInWithEmail', error: error, user_email: email, timestamp: new Date(), log_id: 'user-actions-11' });
      common.setError('Error updating user.', 'globalError');

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
    setInitRender,
    signUpNewUser,
    signInWithEmail
  };
};

export default useUser;
