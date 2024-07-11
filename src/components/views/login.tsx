import { Component, createSignal, Show, onMount } from "solid-js";
import Input from "../atoms/input";
import useUser from "../../state/actions/user-actions";
import { A } from "@solidjs/router";


const Login: Component<{}> = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [signUp, setSignUp] = createSignal(false);
  const { signInWithEmail, signUpNewUser } = useUser();
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

  return (
    <div class="px-4">
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
            <A target="_blank" href="https://bookmarksextension.com/#pricing" class="cursor-pointer flex justify-center mb-2 mt-3 font-bold dark:text-primaryButtonDark text-primaryButtonLight text-md">Are you new?
              <span class="text-white">&nbsp;Sign Up!</span></A>
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
