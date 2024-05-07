import { Component } from "solid-js";
import './common.css'
interface Props {
  width: string
}
const NftmarkBox: Component<Props> = (props) => {

  return (
    <div style={{"background-size":'cover', 'background-image': 'url(/src/assets/temp-box.png)', width: props.width }} class=" overflow-hidden relative responsive-square border-2 border-red self-start rounded-md
    fill-textLight dark:fill-textDark border-textLight dark:border-textDark text-textLight dark:text-textDark">
        <div class="absolute w-full h-full">
          {/* <img src="/src/assets/temp-box.png"></img> */}
        </div>
    </div>);
};

export default NftmarkBox;