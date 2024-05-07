import { Component, createEffect, Show, onMount } from "solid-js";
import Select from "../atoms/select";
import useContent from "../../actions/content-actions/content-actions";
import { ethers } from 'ethers';
import nftmarksApi from "../../api/nftmarks-api";
import Loader from "../atoms/loader/loader";
import { BoxList } from "../organisms/box-list";
import NftmarkBox from "../molecules/nftmark-box";
const provider = new ethers.BrowserProvider((window as any).ethereum);


const Market: Component = () => {
  const categories = [{ label: 'Kinky', value: 'Kinky' }, { label: 'Default', value: 'Default' }];
  const props = useContent();



  const getNftmarks = async () => {
    if(props.nftmarks().length === 0) {
      props.setLoading('nftmarks', true);
      const marks = await nftmarksApi.getNftmarks();
      props.setLoading('nftmarks', false);
      const parsedMarks = marks.map((mark: string) => JSON.parse(mark));
      props.setNftmarks(parsedMarks)
    }
  }

  createEffect(() => {
    // props.nftmarks()
    // props.category()
  });


  onMount(() => {
    getNftmarks();
  })

  return (

    <div class="px-6 relative">
      <Show when={!props.loading().nftmarks} fallback={<Loader />}>
        <Select value={props.category} setValue={props.setCategory} name="Category" options={categories} />
        <div class="mt-2">
          <BoxList RowComponent={NftmarkBox} category={props.category()} list={props.nftmarks()} />
        </div>
      </Show>
    </div>

  );
};

export default Market;