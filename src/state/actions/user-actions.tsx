import { useSelector } from "../../store";
import userApi from "../../api/user-api";
import useCommon from "./common-actions";
import log from "../../util/logger";



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
      if (user.password || user.email) {
        const change: any = {};
        if (user.email) change.email = user.email;
        if (user.password) change.password = user.password;
        await userApi.updateAuth(app.state.user.id, change);
      }
      delete user.password;
      const { data, error } = await userApi.updateUser(app.state.user.id, user);
      if (data) {
        setState(() => {
          return { ...app.state, user: data }
        })
      } else {
        log.error('update-user');
        common.setError('Error updating user.', 'globalError');
      }
    } catch (error: any) {
      log.error('update-user');
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
        let newProfile = null;
        if (!userRes.data) {
          newProfile = await createProfile(user.id, user.email)
        }

        if ((userRes && userRes.data) || newProfile) {
          user = userRes.data || newProfile;

          setState(() => {
            return { ...app.state, user, authed: true, tempBookmarksEnabled: user.temp_bookmarks_enabled }
          })

          setStartView(user.start_view);

        } else {
          common.setError('No user found.', 'globalError');

          //@ts-ignore
          setState(() => {
            return { ...app.state, authed: false }
          })
        }
      }

      common.setLoading(false, 'user');

    } catch (error: any) {
      common.setLoading(false, 'user');
      log.error('identify-user');
      common.setError('Error identifying user.', 'globalError');
    }
    common.setLoading(false, 'user');
  }


  // const connect = async () => {
  //   requestBlockchain()

  // if ((window as any).ethereum) {
  //   try {
  //     const accounts = await provider.send("eth_requestAccounts", []);
  //     const user = await getUserByWalletAddr(accounts[0])


  //     if (user.data) {
  //       setState(() => {
  //         return { ...app.state, user: user.data, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
  //       })
  //     } else if (accounts[0]) {
  //       const user = await userApi.createUser(accounts[0]);
  //       if (user) {
  //         setState(() => {
  //           //@ts-ignore
  //           return { ...app.state, user: data.user, connectedToBlockchain: true, blockchainEnabled: true, authed: true }
  //         })
  //       } else {
  //         log.error(JSON.stringify({ function: 'connect', error: 'Failed to save walletaddr as user', walletaddr_arb: accounts[0], timestamp: new Date(), log_id: 'user-actions-7' })
  //         common.setError('Failed to save user to database', 'globalError');
  //       }
  //     }


  //   } catch (error) {
  //     // setError('Please install crypto wallet');
  //     log.error(JSON.stringify({ function: 'connect', error: error, timestamp: new Date(), log_id: 'user-actions-7' });
  //     common.setError('Error updating user.', 'globalError');
  //   }
  // }
  //}


  async function createProfile(id: string, email: string) {
    // common.setGlobalLoader(true);
    const { data, error } = await userApi.createUser({ email, id });
    if (data) {
      return data
    } else {
      return false
      //log stuff
    }
  }

  async function signUpNewUser(email: string, password: string | null, confirmPassword: string | null) {
    try {
      if (email && password && confirmPassword) {
        if (password === confirmPassword) {
          common.setGlobalLoader(true);
          const userExists = await userApi.getUserByEmail(email);
          if (userExists.data) {
            common.setGlobalLoader(false);
            common.setError('User already exists', 'globalError');
            return false;
          }
          const { data, error } = await userApi.signUpUser(email, password);
          common.setGlobalLoader(false)

          if (data) {
            return true;
          } else {
            log.error('sign-up-new-user');
            common.setError('Failed to sign up with email', 'globalError');
            return false
          }
        } else {
          common.setError('Passwords do not match', 'globalError');
          return false;
        }

      }
    } catch (error: any) {
      log.error('sign-up-new-user');
      common.setError('Error updating user.', 'globalError');
      return false
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
      log.error('sign-in-with-email');
      common.setError('Error updating user.', 'globalError');

    }
  }

  async function signOutUser() {
    const { error } = await userApi.signOutUser();
    if (error) {
      common.setError('Error updating user.', 'globalError');
      log.error('sign-out-user');
    } else {
      if(window) {
        window.location.href = '/index.html'
      }
    }
  }
  
  

  return {
    user,
    setUser,
    identifyUser,
    authed,
    //connect,
    setAuthed,
    updateUser,
    initRender,
    setInitRender,
    signUpNewUser,
    signInWithEmail,
    signOutUser
  };
};

export default useUser;
