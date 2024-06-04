import { Component } from "solid-js";
import './are-you-sure.css';

interface Props {
  onYes: () => void;
  onNo: () => void;
}
const AreYouSure: Component<Props> = (props) => {

  return ( <div style={{'z-index': 1000}} class="absolute  slide-up-from-bottom dark:bg-primaryDark bg-primaryLight h-screen w-full flex flex-col justify-center items-center z-50 top-0 left-0">
    <div class=" fnt-bold text-3xl text-white">Are you sure?</div>
    <div class="flex">

      <button onClick={props.onYes} class="mr-2 px-8 py-2 border-2 hover:dark:bg-transparent hover:bg-transparent dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Yes</button>

      <button onClick={props.onYes} class="ml-2 px-8 py-2 border-2 dark:border-textDark dark:text-textDark text-textLight bg-transparent p-2 mt-6
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">No</button>
    </div>

  </div>)
};

export default AreYouSure;