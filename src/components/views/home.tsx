import { Component, Show, createEffect, onMount, on } from "solid-js";
import { RowList } from "../organisms/row-list";
import Select from "../atoms/select";
import useContent from "../../state/actions/content-actions";
import Login from "./login";
import Loader from "../atoms/loader/loader";
import { BookmarkRow } from "../molecules/bookmark-row";
import { TbFaceIdError } from 'solid-icons/tb'
import { BiSolidMagicWand } from 'solid-icons/bi'
import { useNavigate } from "@solidjs/router";
import { OcTrash2 } from 'solid-icons/oc'
import useUser from "../../state/actions/user-actions";
import useSettings from "../../state/actions/settings-actions";

const Home: Component = () => {

  const categories = [{ label: 'Crypto', value: 'Crypto' }, { label: 'Default', value: 'Default' }];
  const collections = [{ label: 'NFT Research 2023', value: 'NFT Research 2023' }, { label: 'Inception', value: 'Inception' }];
  const navigate = useNavigate();
  const props = useContent();
  const userProps = useUser();
  const settingsProps = useSettings();


  function goToMintPage() {
    props.setMarkToMintAndNavToMintPage();
    navigate('/mint')
  }
  onMount(() => {
    userProps.identifyUser();
    props.getUserBookmarks();
  })


  createEffect(on(props.bookmarksChecked, (checked: any) => {
    // console.log(props.bookmarksChecked, checked);
  }))
  return (
    <Show when={userProps.authed()} fallback={<Login />}>
      <div class="px-6 relative">
        <Show when={settingsProps.blockchainEnabled() && settingsProps.connectedToBlockchain()}>
          <div class="w-full p-1 flex">
            <div onClick={() => props.setMarksView('collections')}
              class={`w-1/2 mx-1 ${props.marksView() === 'collections' ? 'border-b-4' : ''} cursor-pointer border-b-primaryButtonLight dark:border-b-primaryButtonDark rounded-b-md dark:text-textDark text-textLight flex justify-center`}>Collections</div>
            <div onClick={() => props.setMarksView('nfts')}
              class={`w-1/2 mx-1 ${props.marksView() === 'nfts' ? 'border-b-4' : ''} cursor-pointer border-b-primaryButtonLight dark:border-b-primaryButtonDark rounded-b-md dark:text-textDark text-textLight flex justify-center`}>NFTs</div>
          </div>
        </Show>

        <Show when={!props.loading().bookmarks} fallback={<Loader />}>
          {props.marksView() === 'collections' ? <>
            <div class="flex items-center">
              {props.bookmarksChecked() ? <div onClick={props.deleteBookmarks} title="Delete bookmarks." class="w-2/12 flex items-center mt-1 justify-center cursor-pointer">
                <OcTrash2 size="26" class="fill-primaryButtonLight dark:fill-primaryButtonDark roll-in-left" />
              </div> : false}

              <div class={`${props.bookmarksChecked() && settingsProps.blockchainEnabled() ? 'w-8/12' : settingsProps.blockchainEnabled() ? 'w-10/12' : 'w-full'} transition-all`}>
                <Select value={props.collection()} setValue={props.setCollection} name="Collection" options={categories} />
              </div>
              <Show when={settingsProps.blockchainEnabled()}>
                <div title="Mint collection to NFT!" onClick={goToMintPage} class="w-2/12 flex items-center mt-1 justify-center cursor-pointer hover:animate-spin">
                  <BiSolidMagicWand size="30" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
                </div>
              </Show>
            </div>

            <div class="mt-2">
              <RowList hasCheckboxes={true} filterKey="collection" RowComponent={BookmarkRow} filter={props.collection} list={props.bookmarks()} search={props.search} />
            </div>
          </> :
            <>
              <Select value={props.nftmarkName()} setValue={props.setCollection} name="Collection" options={collections} />
              <div class="mt-2">
                {/* <RowList filterKey="collection" RowComponent={BookmarkRow} filter={props.nftmarkName()} list={props.nftmarks()} search={props.search()} /> */}
              </div>
            </>}
        </Show>
      </div>
    </Show>


  );
};

export default Home;
