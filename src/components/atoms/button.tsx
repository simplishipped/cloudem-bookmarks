import { Component } from "solid-js";

interface Props {
  func: (arg: any) => void;
  title: string
}

const Button: Component<Props> = (props) => {
  
  return   <button onClick={props.func} class="px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-4
  font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">{props.title}</button>
};

export default Button;