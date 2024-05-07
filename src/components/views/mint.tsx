import { Component, createSignal } from "solid-js";
import Input from '../atoms/input';
import Select from "../atoms/select";
import Categories from '../../util/categories';
import { ImImage } from 'solid-icons/im'
import Tooltip from "../atoms/tooltip";

const Mint: Component<{}> = (props) => {

  const [name, setName] = createSignal('');
  const [cost, setCost] = createSignal('');
  const [category, setCategory] = createSignal('');
  const [nftImage, setNftImage] = createSignal<File | null>(null);
  const [nftImageUrl, setNftImageUrl] = createSignal('');

  const setNftImageToState = (e: Event) => {
    const element = e.target as HTMLInputElement
    if (element.files && element.files.length > 0) {
      const image: File = element.files[0];
      // @ts-ignore
      setNftImage(image);
      setNftImageUrl(URL.createObjectURL(image));
    }
  }
  let options = Categories.sort();
  const selectOps = options.map(op => ({ label: op, value: op }));


  return (
    <div class="px-6 py-4 relative text-textLight dark:text-textDark">
      <Select value={category()} setValue={setCategory} name="Category" options={selectOps} />

      <div class="mt-2">
        <Input name="Name" value={name} setValue={setName} placeholder="Name of NFT" />
      </div>

      <div class="mt-2">
        <Input type="number" name="cost" value={cost} setValue={setCost} placeholder="$" />
      </div>
      {nftImage() ?
        <img class="w-full mt-2 rounded-md" src={nftImageUrl()}></img>
        :
        <div class="text-textLight dark:text-textDark fill-textLight dark:fill-textDark w-full border-2 px-16 pt-20 pb-16 flex justify-center cursor-pointer
            border-textLight dark:border-textDark rounded-md mt-2 flex-col items-center">
          <label for="file-input" class="cursor-pointer">
            <ImImage style={{ "font-size": "100px" }} class=" text-" />
          </label>
          <input onChange={setNftImageToState} accept="image/png, image/gif, image/jpeg, image/gif" id="file-input" type="file" class="cursor-pointer opacity-0" />
        </div>
      }
      <div class="relative">
        <button id="nft-mark" title="Mint to NFT!" class={`dark:border-textDark 
    dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-2 font-bold w-full items-center rounded-md text-center 
    hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight`} name="NFTmarkName" >Mint</button>
      </div>


    </div>
  );
};

export default Mint;