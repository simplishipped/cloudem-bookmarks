import { Component, Show, createEffect, onMount, on } from "solid-js";
import { RowList } from "../organisms/row-list";
import Select from "../molecules/sub-choices-select";
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
import useCommon from "../../state/actions/common-actions";
import Error from "../atoms/error";

const Home: Component = () => {

  const navigate = useNavigate();
  const props = useContent();
  const userProps = useUser();
  const settingsProps = useSettings();
  const common = useCommon();
  const contentProps = useContent();

  function goToMintPage() {
    props.setMarkToMintAndNavToMintPage();
    navigate('/mint');
  }

  onMount(() => {
    props.getUserBookmarks();
    props.getUserCollections()
    if (userProps.user() && userProps.user().start_view && !userProps.initRender()) {
      navigate('/index.html/add-bookmark');
      userProps.setInitRender(true);
    }
  })

  const deleteBookmarks = async () => {
    if(settingsProps.confirmationsEnabled()) {
      contentProps.setConfirmedAction(props.deleteBookmarks)
    } else {
      await props.deleteBookmarks()
    }
  }

  return (
    <div class="px-4 relative">
      <Show when={settingsProps.blockchainEnabled() && settingsProps.connectedToBlockchain()}>
        <div class="w-full p-1 flex">
          <div onClick={() => props.setMarksView('collections')}
            class={`w-1/2 mx-1 ${props.marksView() === 'collections' ? 'border-b-4' : ''} cursor-pointer border-b-primaryButtonLight dark:border-b-primaryButtonDark rounded-b-md dark:text-textDark text-textLight flex justify-center`}>Collections</div>
          <div onClick={() => props.setMarksView('nfts')}
            class={`w-1/2 mx-1 ${props.marksView() === 'nfts' ? 'border-b-4' : ''} cursor-pointer border-b-primaryButtonLight dark:border-b-primaryButtonDark rounded-b-md dark:text-textDark text-textLight flex justify-center`}>NFTs</div>
        </div>
      </Show>

      <Show when={!props.loading().bookmarks} fallback={<Loader />}>
        <Show when={common.error().homeError}>
          <div class=" w-full flex justify-center">
            <Error close={() => common.setError(null, 'homeError')} error={common.error().homeError} />
          </div>
        </Show>
        {props.marksView() === 'collections' ? <>
          <div class="flex items-center">
            {props.checkedBookmarks().length > 0 ? <div onClick={deleteBookmarks} title="Delete bookmarks." class="w-2/12 flex items-center mt-1 justify-center cursor-pointer">
              <OcTrash2 size="26" class="fill-primaryButtonLight dark:fill-primaryButtonDark roll-in-left" />
            </div> : false}

            <div class={`${props.checkedBookmarks().length > 0 && settingsProps.blockchainEnabled() ? 'w-8/12' : settingsProps.blockchainEnabled() ? 'w-10/12' : 'w-full'} transition-all`}>
              <Select deleteOp={props.deleteCollection} value={props.collection} setValue={props.setCollection} name="Collection" options={props.collections} />
            </div>
            <Show when={settingsProps.blockchainEnabled()}>
              <div title="Mint collection to NFT!" onClick={goToMintPage} class="w-2/12 flex items-center mt-1 justify-center cursor-pointer hover:animate-spin">
                <BiSolidMagicWand size="30" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
              </div>
            </Show>
          </div>

          <div class="mt-2">
            <RowList checkedBookmarks={props.checkedBookmarks} filterKey="collection" RowComponent={BookmarkRow} filter={props.collection} list={props.bookmarks} search={props.search} />
          </div>
        </> :
          <>
            {/* <Select value={props.nftmarkName} setValue={props.setCollection} name="Collection" options={props.collections} /> */}
            <div class="mt-2">
              {/* <RowList filterKey="collection" RowComponent={BookmarkRow} filter={props.nftmarkName()} list={props.nftmarks()} search={props.search()} /> */}
            </div>
          </>}
      </Show>
    </div>


  );
};

export default Home;
