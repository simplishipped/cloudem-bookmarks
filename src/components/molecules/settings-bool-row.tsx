import { Component, createEffect, createSignal } from "solid-js";
import Toggler from "../atoms/toggler";

interface SettingsBoolRowProps {
  titles: string[];
  value: () => boolean;
  setter: (theme: boolean) => void;
  IconTrue: any;
  IconFalse: any;
}

const SettingsBoolRow: Component<SettingsBoolRowProps> = ({ titles, value, setter, IconTrue, IconFalse }) => {
  const [title, setTitle] = createSignal(titles[0]);

  createEffect(() => {
    if (titles.length > 1) {
      setTitle(titles[value() ? 1 : 0]);

    }
  });
  return (
    <div class={`dark:hover:text-secondaryButtonDark deep-hover-transition-three p-2 px-4 mt-2 flex font-medium justify-between w-full items-center cursor-default rounded-3xl btn-hover-one`}>
      <div class="flex">
        {value() ? <IconTrue class="fill-textLight dark:fill-textDark text-textLight dark:text-textDark" size={25} /> : <IconFalse size={25} class="text-textLight fill-textLight dark:fill-textDark dark:text-textDark" />}
        <div class={` text-lg ml-3`}>{title()}</div>
      </div>
      <Toggler enabled={value()} switch={setter} />
    </div>
  );
};

export default SettingsBoolRow;
