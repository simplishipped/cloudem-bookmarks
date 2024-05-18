import { AiOutlinePlusCircle } from "solid-icons/ai";
import { A, useLocation } from "@solidjs/router";
import { createEffect, on } from "solid-js";
import { IoChevronUp } from 'solid-icons/io'
import { Show } from "solid-js";
import useUser from "../../state/actions/user-actions";

const Footer = () => {

  const location = useLocation();
  const { authed } = useUser();

  createEffect(on(
    () => location.pathname,
    () => { }
  ));

  return (
    <Show when={authed()}>

    <div class="flex justify-center w-full p-4 items-center dark:bg-primaryDark bg-primaryLight">
      <div class="cursor-pointer text-textLight dark:text-textDark">
        {location.pathname !== '/' ?
          <A href="/">
            <IoChevronUp size="28" class="text-primaryButtonLight dark:text-primaryButtonDark" />
          </A> :
          <A href="/add-bookmark" title="Add Bookmark" >
            <AiOutlinePlusCircle size="28" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
          </A>}
      </div>
    </div>
    </Show>
  );
};
export default Footer;
