import { Component, createSignal } from "solid-js";
import { FiLink2 } from 'solid-icons/fi'
import { RiArrowsArrowDropDownFill } from 'solid-icons/ri'
import { Bookmark } from "../../types/types"
import Checkbox from "../atoms/checkbox/checkbox";
import useContent from "../../state/actions/content-actions";
import { FiBookmark } from 'solid-icons/fi'

interface BookmarkProps {
  row: () => Bookmark
}

export const BookmarkRow: Component<BookmarkProps> = (props) => {
  const [dropdown, setDropdown] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const contentProps = useContent();


  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.row().url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <div class="deep-hover-transition-one text-primaryButtonLight dark:text-primaryButtonDark  dark:hover:text-textDark py-2 mt-2 px-4 font-bold  
    btn-hover-one cursor-default fill-textLight dark:fill-textDark border-textLight dark:border-textDark  rounded-3xl">

      {copied() ? <div class="dark:bg-darkCompliment text-textDark p-2 rounded-md text-center">Copied to clipboard!</div> : false}
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          {props.row().favicon ? <img class="rounded-full w-4 h-4 mr-2" src={props.row().favicon} /> :
            <FiBookmark size={20} class="dark:!text-textDark text-textLight mr-2" />}
          <Checkbox check={contentProps.setBookmarkChecked} row={props.row} />
          <div class="ml-2 transition-all">{props.row().name.slice(0, 23) + '...'}</div>

        </div>
        <div class="flex items-center">
          <a href={props.row().url} target="_blank">
            <FiLink2 size={20} class="mr-2 cursor-pointer text-textLight dark:text-textDark" />
          </a>
          {/* <BsClipboard2CheckFill
            size={16}
            onClick={() => navigator.clipboard.writeText(props.row().url)}
            class="mr-2 cursor-pointer"
          /> */}
          <RiArrowsArrowDropDownFill
            onClick={() => setDropdown(dropdown() ? false : true)}
            size={30}
            class="cursor-pointer text-textLight dark:text-textDark"
          />

        </div>
      </div>
      {dropdown() ?
        <div class="dropdown flex justify-between items-center mt-1 cursor-pointer">
          <div onClick={copyToClipboard} class="text-textLight 
    dark:text-textDark border-b-2 border-b-primaryButtonLight dark:border-b-primaryButtonDark pb-1">{props.row().url.slice(0, 40) + '...'}</div>

        </div> : false}
    </div>
  );
};
