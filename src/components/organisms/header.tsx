import { RiMapSpaceShipLine } from "solid-icons/ri";
import { FaSolidUserAstronaut } from "solid-icons/fa";
import { TbCurrencyDollar } from "solid-icons/tb";
import { IoChevronBack } from 'solid-icons/io'
import { A, useLocation } from "@solidjs/router";
import { createEffect, on, createSignal } from "solid-js";
import { BiRegularStoreAlt } from 'solid-icons/bi'
import useUser from "../../state/actions/user-actions";
import useSettings from "../../state/actions/settings-actions";
import { FiSearch } from 'solid-icons/fi'
import { Show } from "solid-js";
import Input from '../atoms/input'
import useContent from "../../state/actions/content-actions";

const Header = () => {
  const location = useLocation();
  const [pathBack, setPathBack] = createSignal('');
  const userProps = useUser();
  const settingsProps = useSettings();
  const contentProps = useContent();
  const [showSearch, setShowSearch] = createSignal(false);
  const [animation, startAnimation] = createSignal(false);

  createEffect(on(
    () => location.pathname,
    () => {
      let path = location.pathname.split('/').filter(s => s.length > 0);
      setPathBack(path.splice(0, path.length - 1).join('/'));
    }
  ));

  createEffect(() => {
    if (showSearch()) {
      setTimeout(() => {
        startAnimation(true);
      }, 10);
    } else {
      startAnimation(false);
    }
  })


  return (
    <Show when={userProps.authed()}>
      <Show when={showSearch()}>
        <div class="flex justify-center absolute w-full mt-2 z-20">
          <div class={`transition-all duration-300 ease-in-out pt-1 ${animation() ? 'w-8/12 opacity-1' : 'w-0 opacity-0'}`}>
            <Input onBlur={() => setShowSearch(false)} type="text" placeholder="Search" value={contentProps.search} setValue={contentProps.setSearch} autofocus={true} />
          </div>
        </div>
      </Show>

      <div class="flex justify-between p-4 items-center text-textLight dark:text-textDark">
        {/* <Show when={settingsProps.blockchainEnabled() && settingsProps.connectedToBlockchain()}>
          <div class="cursor-pointer">
            <TbCurrencyDollar size="28" />
          </div>
        </Show> */}
        <div class="cursor-pointer z-30" onClick={() => setShowSearch(showSearch() ? false : true)}>
          <FiSearch size="26" />
        </div>
        <div class="cursor-pointer">
          {location.pathname.includes('/index.html/market') ?
            <A href="/" title="My Bookmarks">
              <RiMapSpaceShipLine size="32" class="text-primaryButtonLight dark:text-primaryButtonDark " />
            </A>
            :
            <Show when={settingsProps.blockchainEnabled() && settingsProps.connectedToBlockchain()}>
              <A href="/index.html/market" title="NFTmarks Marketplace">
                <BiRegularStoreAlt size="32" class="fill-primaryButtonLight dark:fill-primaryButtonDark text-primaryButtonLight dark:text-primaryButtonDark" />
              </A>
            </Show>
          }
        </div>

        <div class="cursor-pointer z-30">
          {location.pathname.includes('/account') ?
            <A href={pathBack()} title="Back">
              <IoChevronBack size="23" />
            </A>
            : (
              <A href="/index.html/account" title="Settings" >
                <FaSolidUserAstronaut size="23" class="fill-textLight dark:fill-textDark " />
              </A>
            )}
        </div>
      </div>
    </Show>

  );
};
export default Header;
