import { Accessor, Component, Setter, createEffect, createSignal, onMount, Show } from "solid-js";
import { ethers } from 'ethers';
import Input from "../atoms/input";
import supabase from "../../api/supabase";
import useSettings from "../../state/actions/settings-actions/settings-actions";
import useContent from "../../state/actions/content-actions/content-actions";
import Loading from "./loading/loading";
const provider = new ethers.BrowserProvider((window as any).ethereum);

interface LoginProps {

}

const Login: Component<LoginProps> = () => {
  const [error, setError]: [() => null | string, Setter<null | string>] = createSignal(null);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [signUp, setSignUp] = createSignal(false);
  const { setConnected, blockchain } = useSettings();
  const { setUser, user } = useContent();
  const [loading, setLoading] = createSignal(false);

  const [errorMsg, setErrorMsg] = createSignal('');

  const connect = async () => {
    if ((window as any).ethereum) {
      try {
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.send("eth_requestAccounts", []);
        let { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('walletaddr_arb', accounts[0]);

        if (users && users.length > 0) {
          setConnected(true);
          setUser(users[0]);
        } else {
          const { data, error } = await supabase
            .from('users')
            .insert([{ walletaddr_arb: accounts[0] }]);
          console.log(data)
          if (data) {
            setConnected(true);
          } else {
            setError('Failed to save user to database');
          }
        }

        setConnected(true);
      } catch (err) {
        setError('Please install crypto wallet');
      }
    }
  }

  async function signUpNewUser() {
    if (email() && password() && confirmPassword()) {
      if (password() === confirmPassword()) {
        const { data, error } = await supabase.auth.signUp({
          email: email(),
          password: password(),
        })
        if (data) {
          setError('');
          // await signInNewUser();
        } else {
          setError('Failed to sign up with email');
        }
      } else {
        setErrorMsg('Passwords do not match');
      }
    }
  }


  async function signInWithEmail() {
    if (email() && password()) {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      })
      if (error) {
        setError('Credentials are incorrect');
      } else {
        setConnected(true);
      }
      setLoading(false)
    }
  }

  return (
    <div class="px-6">
      {error() ? <div class=" bg-red-500 p-4 rounded-md flex items-center justify-center dark:text-white text-black">{error()}</div> : false}
      <button onClick={connect} class="px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Connect Wallet</button>

      <Show when={signUp()} fallback={
        <h1 class="text-center mb-2 mt-6 font-bold dark:text-textDark text-textLight text-2xl">Sign in with email.</h1>}>
        <h1 class="text-center mb-2 mt-6 font-bold dark:text-textDark text-textLight text-2xl">Sign up with email.</h1>
      </Show>

      <div class="pt-2">
        <Input name="email" placeholder="Email" setValue={setEmail} value={email} />
      </div>
      <div class="pt-2">
        <Input type="password" name="password" placeholder="Password" setValue={setPassword} value={password} />
      </div>

      <Show when={signUp()}>
        <div class="pt-2">
          <Input type="password" name="confirmPassword" placeholder="Confirm Password" setValue={setConfirmPassword} value={confirmPassword} />
        </div>
      </Show>

      <Show when={signUp()} fallback={
        <button onClick={signInWithEmail} class="px-4 py-2 mt-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 
              font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Sign In</button>}>
        <button onClick={signUpNewUser} class="px-4 py-2 mt-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Sign Up</button>
      </Show>

      <Show when={signUp()} fallback={
        <h1 onClick={() => setSignUp(true)} class="cursor-pointer text-center mb-2 mt-3 font-bold dark:text-textDark text-textLight text-md">Are you new?
          <span class="text-white">&nbsp;Sign Up!</span></h1>
      }>
        <h1 onClick={() => setSignUp(false)} class="cursor-pointer text-center mb-2 mt-3 font-bold dark:text-white text-textLight text-md">Sign In</h1>
      </Show>
      {loading() ? <Loading /> : false}

    </div>
  );
};

export default Login;
