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
    <A href={navTo} class={`dark:hover:text-secondaryButtonDark deep-hover-transition-three  p-2 px-4 mt-2 flex font-medium justify-between w-full items-center rounded-3xl cursor-pointer btn-hover-one`}>
      <div class={`flex`}>
        <Icon class="fill-textLight dark:fill-textDark text-textLight dark:text-textDark" size={25} />
        <div class="ml-3 text-lg">{title}</div>
      </div>
      <FaSolidChevronRight size={15}  class="fill-textLight dark:fill-textDark" />
    </A>

  );
};

export default SettingsNavRow