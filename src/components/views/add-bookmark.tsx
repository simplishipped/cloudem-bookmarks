import { Component, createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Select from "../atoms/select";
import Input from '../atoms/input';
import useContent from "../../state/actions/content-actions";

const AddBookmark: Component<{}> = () => {
  
  const navigate = useNavigate();
  const props = useContent();
  const [name, setName] = createSignal('');
  const [nftMark, setNftMark] = createSignal(window.location.href);
  // const [category, setCategory] = createSignal('Category');

  const addBookmark = () => {
    //@ts-ignore
    props.addBookmark({ name: name(), url: nftMark(), collection: props.newCollection() === 'Default' ? 'Default' : props.newCollection(), user_id: 1 });
    navigate('/')
  }


  return (
    <div class="px-6 text-textLight dark:text-textDark">
      <Select value={props.newCollection} setValue={props.setNewCollection} name="Category" options={props.collections} />

      <div class="mt-4">
        <Input value={name} name="NFTmarkName" placeholder="Bookmark Name" setValue={setName} />
      </div>
      <div class="mt-4">
        <Input value={nftMark} name="NFTmarkName" placeholder="Bookmark" setValue={setNftMark} />
      </div>
      <div class="mt-4">
        <button id="nft-mark" class={`dark:border-textDark 
    dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-2 font-bold w-full items-center rounded-md text-center 
    hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight`} name="NFTmarkName" onClick={addBookmark}>Save</button>
      </div>
    </div>);
};

export default AddBookmark;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE4NzY4NDhBNDMzOEYxNEFENzQ4YzJBMTE1OUJGN0Q2ZTg4NDkwNTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTQ1OTgxNTM2OSwibmFtZSI6Im5mdG1hcmtzIn0.pcVrreBzvp5h6UaOzo1Of4RWJ7oX8aDfq7p0r4o9aGQ