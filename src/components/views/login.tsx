import { Component, Setter, createSignal, Show, onMount } from "solid-js";
import Input from "../atoms/input";
import useSettings from "../../state/actions/settings-actions";
import Loading from "./loading/loading";
import useUser from "../../state/actions/user-actions";
import useCommon from "../../state/actions/common-actions";


const Login: Component<{}> = () => {
  const [error, setError]: [() => null | string, Setter<null | string>] = createSignal(null);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [signUp, setSignUp] = createSignal(false);
  const { globalLoader } = useCommon();
  const { connect, signInWithEmail, signUpNewUser } = useUser();
  const [listenerForMetaMask, setListenerForMetaMask] = createSignal(false);
  const [signedUp, setSignedUp] = createSignal(false);



  async function signUpUser() {
    const createdAuth = await signUpNewUser(email(), password(), confirmPassword());
    if (createdAuth) {
      setSignedUp(true);
      setConfirmPassword('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setSignedUp(false);
      }, 3000)
    }
  }

  async function signIn() {
    signInWithEmail(email(), password());
  }

  onMount(() => {
    //@ts-ignore
    if (window.chrome && window.chrome.runtime && !listenerForMetaMask()) {
      setListenerForMetaMask(true);
      //@ts-ignore
      window.chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
        if (message.type === 'METAMASK_RESULT') {
          if (message.success) {
            return true;
          } else {
            return true;
          }
        }
      });
    }

  })


  return (
    <div class="px-4">
      {error() ? <div class=" bg-red-500 p-4 rounded-md flex items-center justify-center dark:text-white text-black">{error()}</div> : false}
      

      <Show when={signedUp()} fallback={
        <>
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
            <button onClick={signIn} class="px-4 py-2 mt-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 
              font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Sign In</button>}>
            <button onClick={signUpUser} class="px-4 py-2 mt-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Sign Up</button>
          </Show>

          <Show when={signUp()} fallback={
            <h1 onClick={() => setSignUp(true)} class="cursor-pointer text-center mb-2 mt-3 font-bold dark:text-primaryButtonDark text-primaryButtonLight text-md">Are you new?
              <span class="text-white">&nbsp;Sign Up!</span></h1>
          }>
            <h1 onClick={() => setSignUp(false)} class="cursor-pointer text-center mb-2 mt-3 font-bold dark:text-primaryButtonDark text-primaryButtonLight text-md">Already a member?
              <span class="text-white">&nbsp;Sign In!</span>
            </h1>
          </Show>
        </>
      }>
        <div class="text-green-400 mt-20 text-xl  text-center">Check your email for confirmation!</div>
      </Show>

    </div>
  );
};

export default Login;
