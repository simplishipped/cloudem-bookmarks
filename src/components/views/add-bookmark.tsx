import { Component, createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Select from "../atoms/select";
import Input from '../atoms/input';
import useContent from "../../state/actions/content-actions";

const AddBookmark: Component<{}> = () => {
  const categories = [{ label: 'Kinky', value: 'kinky' }, { label: 'Default', value: 'default' }];
  const collections = [{ label: 'NFT Research 2023', value: 'NFT Research 2023' }, { label: 'Default', value: 'Default' }];

  const navigate = useNavigate();
  const props = useContent();
  const [name, setName] = createSignal('');
  const [nftMark, setNftMark] = createSignal(window.location.href);
  // const [category, setCategory] = createSignal('Category');

  const createNftMark = () => {
    if (props.marksView() === 'collections') {
      props.addBookmark({ name: name(), url: nftMark(), collection: props.collection() === 'Collection' ? 'Default' : props.collection(), user_id: 1 }, 'categories');
    } else {
      // props.addBookmark({ IS_COLLECTION: true, NAME: name(), URL: nftMark(), COLLECTION: props.collection() === 'Inception' ? 'Inception' : props.category(), USERID: '652d5eb3d7e492b02c050f70' }, 'collections');
    }
    navigate('/')
  }


  return (
    <div class="px-6 text-textLight dark:text-textDark">
      {props.marksView() === 'collections' ? <Select value={props.collection()} setValue={props.setCategory} name="Category" options={categories} />
        : <Select value={props.collection()} setValue={props.setCollection} name="Collection" options={collections} />
      }
      <div class="mt-4">
        <Input value={name} name="NFTmarkName" placeholder="Bookmark Name" setValue={setName} />
      </div>
      <div class="mt-4">
        <Input value={nftMark} name="NFTmarkName" placeholder="Bookmark" setValue={setNftMark} />
      </div>
      <div class="mt-4">
        <button id="nft-mark" class={`dark:border-textDark 
    dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-2 font-bold w-full items-center rounded-md text-center 
    hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight`} name="NFTmarkName" onClick={createNftMark}>Save</button>
      </div>
    </div>);
};

export default AddBookmark;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE4NzY4NDhBNDMzOEYxNEFENzQ4YzJBMTE1OUJGN0Q2ZTg4NDkwNTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTQ1OTgxNTM2OSwibmFtZSI6Im5mdG1hcmtzIn0.pcVrreBzvp5h6UaOzo1Of4RWJ7oX8aDfq7p0r4o9aGQ