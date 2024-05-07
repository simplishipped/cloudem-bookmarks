import { Component } from "solid-js";
import { FaSolidChevronRight } from "solid-icons/fa";
import { A } from "@solidjs/router";
interface SettingsNavRowProps {
  title: string,
  navTo: string,
  Icon: any
}

const SettingsNavRow: Component<SettingsNavRowProps> = ({ navTo, Icon, title }) => {

  return (
    <A href={navTo} class={`p-2 mt-2 flex font-bold justify-between w-full items-center rounded-md hover:dark:bg-secondaryDark hover:bg-secondaryLight`}>
      <div class={`flex`}>
        <Icon class="fill-textLight dark:fill-textDark" size={25} />
        <div class="ml-3 text-xl">{title}</div>
      </div>
      <FaSolidChevronRight size={15}  class="fill-textLight dark:fill-textDark" />
    </A>

  );
};

export default SettingsNavRow