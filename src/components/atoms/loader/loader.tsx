import { Component } from "solid-js";
import './loader.css';
const Loader: Component = () => {

  return (
    <div style={{height: 'calc(100vh - 230px'}} class=" w-full flex justify-center items-center"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>);
};

export default Loader;