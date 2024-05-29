import { Component } from "solid-js";
import { IoCloseCircleOutline } from 'solid-icons/io'

interface Props {
  error: string | null
  close: () => void;
}

const Error: Component<Props> = (props) => {

  return (

    <div class="p-2 bg-red-500 rounded-md w-full flex items-center justify-between text-wrap">
      <div class="text-white font-bold text-wrap">{props.error}</div>
      <IoCloseCircleOutline size={25} onClick={props.close} class=" self-start  text-white cursor-pointer fill-white" />
    </div>
  )
};

export default Error;