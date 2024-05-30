import { Component } from "solid-js";
import Loader from "../../atoms/loader/loader";
import './loading.css';

const Loading: Component<{}> = () => {

  return <div class="absolute  slide-up-from-bottom dark:bg-primaryDark bg-primaryLight h-screen w-full flex justify-center items-center z-50 top-0 left-0">
    <Loader />
  </div>;
};

export default Loading;