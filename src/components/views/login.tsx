import { Accessor, Component, Setter, createEffect, createSignal, onMount } from "solid-js";
import {ethers} from 'ethers';
const provider = new ethers.BrowserProvider((window as any).ethereum);

interface LoginProps {
  connected: () => boolean
  setConnected: (connected: boolean) => void
}

const Login: Component<LoginProps> = ({ connected, setConnected }) => {
  const [error, setError] = createSignal('');

  const connect = async () => {
    if ((window as any).ethereum) {
      try {
        await provider.send("eth_requestAccounts", [])
        setConnected(true);
      } catch (err) {
        setError('Please install crypto wallet');
      }
    }
  }

  return (
    <div class="px-6">
      {error().length > 0 ? <div class=" bg-red-500 p-4">{error()}</div> : false}
      <button onClick={connect} class="px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Connect</button>
    </div>
  );
};

export default Login;
