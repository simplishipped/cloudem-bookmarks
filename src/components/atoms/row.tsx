import { Component } from "solid-js";

const Row: Component<{
  value: () => string
}> = (props) => {
  
  return <div class="deep-hover-transition-four text-primaryButtonLight dark:text-primaryButtonDark  dark:hover:text-textDark py-2 mt-2 px-4 font-bold  
    btn-hover-one cursor-default fill-textLight dark:fill-textDark border-textLight dark:border-textDark  rounded-3xl">
      <div>{props.value()}</div>
      </div>;
};

export default Row;