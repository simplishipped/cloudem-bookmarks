import { Component, createEffect, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Select from "../atoms/select";
import Input from '../atoms/input';
import useContent from "../../state/actions/content-actions";
import useCommon from "../../state/actions/common-actions";
import Error from "../atoms/error";
import useUser from "../../state/actions/user-actions";

const AddBookmark: Component<{}> = () => {

//   chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     let url = tabs[0].url;
//     // use `url` here inside the callback because it's asynchronous!
// });
  const navigate = useNavigate();
  const props = useContent();
  const [name, setName] = createSignal('');
  const [nftMark, setNftMark] = createSignal(window.location.href);
  const userProps = useUser();
  const common = useCommon()
  // const [category, setCategory] = createSignal('Category');

  const addBookmark = () => {
    
    //@ts-ignore
    props.addBookmark({ name: name(), url: nftMark(), collection: props.newCollection() === 'Default' ? 'Default' : props.newCollection(), user_id: userProps.user().id });
    navigate('/index.html');
  }


  return (
    <div class="px-6 text-textLight dark:text-textDark">
      <Show when={common.error().addBookmarkError}>
        <div class=" w-full flex justify-center">
          <Error close={() => common.setError(null, 'addBookmarkError')} error={common.error().addBookmarkError} />
        </div>
      </Show>
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