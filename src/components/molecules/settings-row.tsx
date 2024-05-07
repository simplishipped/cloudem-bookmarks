import { Component } from "solid-js";

interface SettingsRowProps {
  name: string
}

const SettingsRow: Component<SettingsRowProps> = ({name}) => {
  
  return (
    <div class="cursor-pointer py-2 mt-2 px-2 font-bold border-solid border-2 border-textLight dark:border-textDark text-textLight dark:text-textDark rounded-md">
      <div class="flex justify-between items-center">
        <div>{name}</div>
      </div>
    </div>
  );
};

export default SettingsRow;