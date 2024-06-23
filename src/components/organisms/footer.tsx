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
    () => {}
  ));

  return (
    <Show when={authed()}>
      <div class="flex justify-center w-full p-4 items-center dark:bg-primaryDark bg-primaryLight">
        <div class="cursor-pointer text-textLight dark:text-textDark">
          {location.pathname !== '/index.html' ?
            <A href="/index.html" title="Back to Home" >
              <IoChevronUp size="28" class="text-textLight dark:text-textDark" />
            </A> :
            <A href="/index.html/add-bookmark" title="Add Bookmark" >
              <AiOutlinePlusCircle size="28" class="fill-textLight dark:fill-textDark" />
            </A>}
        </div>
      </div>
    </Show>
  );
};
export default Footer;
