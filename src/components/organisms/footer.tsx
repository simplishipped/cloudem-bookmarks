import { AiOutlinePlusCircle } from "solid-icons/ai";
import { A, useLocation } from "@solidjs/router";
import { createEffect, on } from "solid-js";
import { IoChevronUp } from 'solid-icons/io'


const Footer = () => {

  const location = useLocation()

  createEffect(on(
    () => location.pathname,
    () => { }
  ));

  return (
    <div class="flex justify-center w-full p-4 items-center dark:bg-primaryDark bg-primaryLight">
      <div class="cursor-pointer text-textLight dark:text-textDark">
        {location.pathname !== '/' ?
          <A href="/">
            <IoChevronUp size="28" class="text-primaryButtonLight dark:text-primaryButtonDark" />
          </A> :
          <A href="/add-nft-mark" title="Add Bookmark" >
            <AiOutlinePlusCircle size="28" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
          </A>}
      </div>
    </div>
  );
};
export default Footer;
