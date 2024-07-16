import { Component } from "solid-js";

const Row: Component<{
  value: () => string,
  Icon?: any
  func?: () => void
}> = (props) => {
  
  return <div onClick={props.func} class="cursor-pointer flex items-center deep-hover-transition-four text-primaryButtonLight dark:text-primaryButtonDark  dark:hover:text-textDark py-2 mt-2 px-4 font-bold  
    btn-hover-one  fill-textLight dark:fill-textDark border-textLight dark:border-textDark  rounded-3xl">
      {props.Icon ? <props.Icon size="25" /> : false}
      <div class="ml-3 text-lg">{props.value()}</div>
      </div>;
};

export default Row;