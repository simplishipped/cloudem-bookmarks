import { Component } from "solid-js";
import Toggler from "../atoms/toggler";

interface SettingsBoolRowProps {
  title: string;
  value: () => boolean;
  setter: (theme: boolean) => void;
  IconTrue: any;
  IconFalse: any;
}

const SettingsBoolRow: Component<SettingsBoolRowProps> = ({ title, value, setter, IconTrue, IconFalse }) => {
  return (
    <div class={`p-2 mt-2 flex font-bold justify-between w-full items-center rounded-md hover:dark:bg-secondaryDark hover:bg-secondaryLight`}>
      <div class="flex">
        {value() ? <IconTrue class="fill-textLight dark:fill-textDark" size={25} /> : <IconFalse size={25} class="fill-textLight dark:fill-textDark" />}
        <div class={`text-xl ml-3`}>{title}</div>
      </div>

      <Toggler enabled={value()} switch={setter} />
    </div>
  );
};

export default SettingsBoolRow;
