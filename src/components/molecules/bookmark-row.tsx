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
  const contentProps = useContent();



  return (
    <div class=" py-2 mt-2 px-2 font-bold  bookmark-hover cursor-default fill-textLight dark:fill-textDark border-textLight dark:border-textDark text-textLight dark:text-textDark rounded-md">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          {props.row().favicon ? <img class=" rounded-full w-4 h-4 mr-2" src={props.row().favicon}/> : 
            <FiBookmark size={20} class="dark:text-textDark text-textLight mr-2" />}
          <Checkbox check={contentProps.setBookmarkChecked} row={props.row} />
          <div class="text-primaryButtonLight dark:text-primaryButtonDark ml-2">{props.row().name.slice(0, 23)+'...'}</div>

        </div>
        <div class="flex items-center">
          <a href={props.row().url} target="_blank">
            <FiLink2 size={20} class="mr-2 cursor-pointer" />
          </a>
          {/* <BsClipboard2CheckFill
            size={16}
            onClick={() => navigator.clipboard.writeText(props.row().url)}
            class="mr-2 cursor-pointer"
          /> */}
          <RiArrowsArrowDropDownFill
            onClick={() => setDropdown(dropdown() ? false : true)}
            size={30}
            class="cursor-pointer"
          />

        </div>
      </div>
      {dropdown() ?
        <div class="dropdown flex justify-between items-center mt-1 ">
          <div class="border-b-2 border-b-primaryButtonLight dark:border-b-primaryButtonDark pb-1">{props.row().url}</div>

        </div> : false}
    </div>
  );
};
