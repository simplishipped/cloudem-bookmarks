import { Component, createEffect, Show, onMount, createSignal } from "solid-js";
import { RowList } from "../organisms/row-list";
import Select from "../atoms/select";
import useContent from "../../state/actions/content-actions/content-actions";
import Login from "./login";
import { ethers } from 'ethers';
import useSettings from "../../state/actions/settings-actions/settings-actions";
import bookmarksApi from "../../api/bookmarks-api";
import Loader from "../atoms/loader/loader";
import { BookmarkRow } from "../molecules/bookmark-row";
import { TbFaceIdError } from 'solid-icons/tb'
import { BiSolidMagicWand } from 'solid-icons/bi'
import { Bookmark } from "../molecules/types";
import { useNavigate } from "@solidjs/router";

const provider = new ethers.BrowserProvider((window as any).ethereum);

const Home: Component = () => {
  const categories = [{ label: 'Crypto', value: 'Crypto' }, { label: 'Default', value: 'Default' }];
  const collections = [{ label: 'NFT Research 2023', value: 'NFT Research 2023' }, { label: 'Inception', value: 'Inception' }];
  const navigate = useNavigate();

  const props = useContent();
  const { setConnected, connected } = useSettings();


  const isConnected = async () => {
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length) {
      setConnected(true)
    } else {
      setConnected(false);
    }
  }
  const getUserBookmarks = async () => {
    if (props.bookmarks().length === 0) {
      props.setLoading('bookmarks', true);
      const marks = await bookmarksApi.getBookmarksByUser(1);
      props.setLoading('bookmarks', false);
      if (marks) {
        props.setBookmarks(marks);
      }

      // props.setBookmarks(bookmarks);
      // props.setCollections(collections);
    }
  }

  onMount(() => {
    isConnected();
    getUserBookmarks();
  })

  const setMarkToMintAndNavToMintPage = () => {
    const collection = props.bookmarks();
    const nftmark = {
      bookmarks: collection,
      name: props.collection(),
      user_id: 1,
      category: props.nft_category()
    }
    props.setMarkToMint(nftmark);
    navigate('/mint')
  }

  return (
    <Show when={connected()} fallback={<Login connected={connected} setConnected={setConnected} />}>
      <div class="px-6 relative">
        <div class="w-full p-1 flex">
          <div onClick={() => props.setMarksView('collections')}
            class={`w-1/2 mx-1 ${props.marksView() === 'collections' ? 'border-b-4' : ''} cursor-pointer border-b-primaryButtonLight dark:border-b-primaryButtonDark rounded-b-md dark:text-textDark text-textLight flex justify-center`}>Collections</div>
          <div onClick={() => props.setMarksView('nfts')}
            class={`w-1/2 mx-1 ${props.marksView() === 'nfts' ? 'border-b-4' : ''} cursor-pointer border-b-primaryButtonLight dark:border-b-primaryButtonDark rounded-b-md dark:text-textDark text-textLight flex justify-center`}>NFTs</div>
        </div>
        <Show when={!props.loading().bookmarks} fallback={<Loader />}>
          {props.marksView() === 'collections' ? <>
            <div class="flex items-center">
              <div class="w-10/12">
                <Select value={props.collection()} setValue={props.setCollection} name="Collection" options={categories} />  </div>
              <div title="Mint collection to NFT!" onClick={setMarkToMintAndNavToMintPage} class="w-2/12 flex items-center mt-1 justify-center cursor-pointer hover:animate-spin">
                <BiSolidMagicWand size="30" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
              </div>
            </div>

            <div class="mt-2">
              <RowList filterKey="collection" RowComponent={BookmarkRow} filter={props.collection()} list={props.bookmarks()} />
            </div>
          </> :
            <>
              <Select value={props.nftmarkName()} setValue={props.setCollection} name="Collection" options={collections} />
              <div class="mt-2">
                <RowList filterKey="collection" RowComponent={BookmarkRow} filter={props.nftmarkName()} list={props.nftmarks()} />
              </div>
            </>}
        </Show>
      </div>
    </Show>
  );
};

export default Home;
