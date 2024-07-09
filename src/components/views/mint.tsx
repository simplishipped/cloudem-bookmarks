// import { Component, createSignal, Show } from "solid-js";
// import Input from '../atoms/input';
// import Select from "../atoms/select";
// import Categories from '../../util/categories';
// import { ImImage } from 'solid-icons/im';
// import useContent from "../../state/actions/content-actions";
// import { mintCollectionToNft } from "../../api/nftmarks-api";
// import { BsHandThumbsUpFill } from 'solid-icons/bs';
// import Loader from "../atoms/loader/loader";
// import Success from "../atoms/success/success";
// // import Tooltip from "../atoms/tooltip";

// const Mint: Component<{}> = () => {

//   const [name, setName] = createSignal('');
//   const [price, setPrice] = createSignal('');
//   const [category, setCategory] = createSignal('');
//   const [nftImage, setNftImage] = createSignal<File | null>(null);
//   const [nftImageUrl, setNftImageUrl] = createSignal('');
//   const [success, setSuccess] = createSignal(false);
//   const props = useContent();



//   const setNftImageToState = (e: Event) => {
//     const element = e.target as HTMLInputElement
//     if (element.files && element.files.length > 0) {
//       const image: File = element.files[0];
//       // @ts-ignore
//       setNftImage(image);
//       setNftImageUrl(URL.createObjectURL(image));
//     }
//   }
//   let options = Categories.sort();
//   const selectOps = options.map(op => ({ label: op, value: op }));


//   const mint = async () => {
//     if (props.markToMint()) {
//       let nft = {
//         ...props.markToMint(),
//         user_id: 1,
//         name: name(),
//         price: Number(price()),
//         category: category(),
//       }
//       props.setLoading('mint', true);
//       try {
//         await mintCollectionToNft(nft);
//         setName('');
//         setPrice('');
//         setCategory('');
//         setNftImage(null);
//         setSuccess(true);
//         setTimeout(() => {
//           setSuccess(false);
//         }, 1500);
//       } catch (err) {
//         props.setLoadFailed('mint', true);
//       }
//       props.setLoading('mint', false);
//     }
//   }

//   return (
//     <Show when={!props.loading().mint} fallback={<Loader />}>
//       <Show when={!success()} fallback={
//         <div class=" h-3/4 flex justify-center items-center">
//           <Success />
//         </div>
//       }>
//         <div class="px-6 py-4 relative text-textLight dark:text-textDark">
//           <Select value={category()} setValue={setCategory} name="Category" options={selectOps} />

//           <div class="mt-2">
//             <Input name="Name" value={name} setValue={setName} placeholder="Name of NFT" />
//           </div>
//           <div class="mt-2">
//             <Input type="number" name="price" value={price} setValue={setPrice} placeholder="$" />
//           </div>
//           {nftImage() ?
//             <img class="w-full mt-2 rounded-md" src={nftImageUrl()}></img>
//             :
//             <div class="text-textLight dark:text-textDark fill-textLight dark:fill-textDark w-full border-2 px-16 pt-20 pb-16 flex justify-center cursor-pointer
//             border-textLight dark:border-textDark rounded-md mt-2 flex-col items-center">
//               <label for="file-input" class="cursor-pointer">
//                 <ImImage style={{ "font-size": "100px" }} class=" text-" />
//               </label>
//               <input onChange={setNftImageToState} accept="image/png, image/gif, image/jpeg, image/gif" id="file-input" type="file" class="cursor-pointer opacity-0" />
//             </div>
//           }
//           <div class="relative">
//             <button onClick={mint} id="nft-mark" title="Mint to NFT!" class={`dark:border-textDark 
//     dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-2 font-bold w-full items-center rounded-md text-center 
//     hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight`} name="NFTmarkName" >Mint</button>
//           </div>
//         </div>
//       </Show>

//     </Show>

//   );
// };

// export default Mint;