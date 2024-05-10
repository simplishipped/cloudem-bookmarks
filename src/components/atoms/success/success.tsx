import { Component } from "solid-js";
import { BsHandThumbsUpFill } from 'solid-icons/bs';
import './success.css';
const success: Component<{}> = (props) => {

  return (

    <BsHandThumbsUpFill size="50" class="fill-primaryButtonLight dark:fill-primaryButtonDark swirl-in-fwd" />

  )
};

export default success;