import { Component, createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Select from "../molecules/sub-choices-select";
import Input from '../atoms/input';
import useContent from "../../state/actions/content-actions";
import useCommon from "../../state/actions/common-actions";
import Error from "../atoms/error";
import useUser from "../../state/actions/user-actions";
import Toggler from "../atoms/toggler";

const AddBookmark: Component<{}> = () => {
  const navigate = useNavigate();
  const props = useContent();
  const [name, setName] = createSignal('');
  const [bookmark, setBookmark] = createSignal(window.location.href);
  const [favicon, setFavicon] = createSignal('');
  const userProps = useUser();
  const common = useCommon();
  const [temporary, setTemporary] = createSignal(false);



  //@ts-ignore
  async function getUrl() {
    //@ts-ignore
    if (window && window.chrome) {
      //@ts-ignore
      const tabs = await chrome.tabs.query({ active: true });
      const url = tabs[0].url;
      const favicon = tabs[0].favIconUrl;
      const title = tabs[0].title;
      setName(title)
      setFavicon(favicon);
      setBookmark(url);
    }
  }

  onMount(() => {
    getUrl();
    props.setNewCollection(props.collection());
  });

  const addBookmark = async () => {
    //@ts-ignore
    const done = await props.addBookmark({
      name: name(),
      url: bookmark(),
      collection: props.newCollection(),
      user_id: userProps.user().id,
      favicon: favicon(),
      temporary: temporary()
    });
    if (done) {
      navigate('/index.html');
    }
  }

  return (
    <div class="px-4 text-textLight dark:text-textDark">
      <Show when={common.error().addBookmarkError}>
        <div class=" w-full flex justify-center">
          <Error close={() => common.setError(null, 'addBookmarkError')} error={common.error().addBookmarkError} />
        </div>
      </Show>
      {/*@ts-ignore*/}
      {props.newCollection() ? <Select collectionParentId={props.newCollectionParentId} setParentValueId={props.setNewCollectionParentId} value={props.newCollection} setValue={props.setNewCollection}
        name="Category" options={props.collections} /> : false}

      <div class="mt-4">
        <Input value={name} name="NFTmarkName" placeholder="Bookmark Name" setValue={setName} />
      </div>
      <div class="mt-4">
        <Input value={bookmark} name="NFTmarkName" placeholder="Bookmark" setValue={setBookmark} />
      </div>
      <Show when={userProps.user().temp_bookmarks_enabled}>
        <div class="flex mt-4 px-2 items-center font-bold">
          <Toggler enabled={temporary()} switch={setTemporary} />
          <div class="ml-4">{temporary() ? 'Temporary (1 month)' : 'Permanent'}  </div>
        </div>
      </Show>
      <div class="mt-4">
        <div class="px-1">
          <button id="nft-mark" class={`dark:border-textDark 
    dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-2 font-bold w-full items-center rounded-md text-center 
    hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight`} name="NFTmarkName" onClick={addBookmark}>Save</button>
        </div>
      </div>
    </div>);
};

export default AddBookmark;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE4NzY4NDhBNDMzOEYxNEFENzQ4YzJBMTE1OUJGN0Q2ZTg4NDkwNTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTQ1OTgxNTM2OSwibmFtZSI6Im5mdG1hcmtzIn0.pcVrreBzvp5h6UaOzo1Of4RWJ7oX8aDfq7p0r4o9aGQ