import { Component, Show } from "solid-js";
import {
  FaSolidNetworkWired,
  FaRegularMoon,
  FaSolidSun,
  FaRegularCircleQuestion,
  FaSolidListUl
} from "solid-icons/fa";
import { } from "solid-icons/fa";
import useTheme from "../../../state/actions/theme-actions";
import SettingsNavRow from "../../molecules/settings-nav-row";
import SettingsBoolRow from "../../molecules/settings-bool-row";
import { ImCloudDownload } from 'solid-icons/im'
import { AiOutlineBlock } from 'solid-icons/ai'
import { ImBlocked } from 'solid-icons/im'
import { RiMediaPlayListAddFill } from 'solid-icons/ri'
import useSettings from "../../../state/actions/settings-actions";


const Settings: Component<{}> = () => {
  const { theme, setTheme } = useTheme();
  const settingsProps = useSettings()


  return (
    <div class={`text-textLight dark:text-textDark px-6 pt-2 transition-colors`}>
      <SettingsBoolRow IconTrue={FaRegularMoon} IconFalse={FaSolidSun} titles={["Dark Theme", "Light Theme"]} setter={setTheme} value={theme} />
      <SettingsBoolRow IconTrue={FaSolidListUl} IconFalse={RiMediaPlayListAddFill} titles={['Starts App Into Adding', 'Starts App Into List']} setter={settingsProps.setLandingView} value={settingsProps.landingView} />
      <SettingsBoolRow IconTrue={ImBlocked} IconFalse={AiOutlineBlock} titles={['Enable Blockchain', 'Disable Blockchain']} setter={settingsProps.enableBlockchain} value={settingsProps.blockchainEnabled} />
      <Show when={settingsProps.blockchainEnabled()}>
        <SettingsNavRow navTo={"/account/networks"} title="Network" Icon={FaSolidNetworkWired} />
      </Show>
      <SettingsNavRow navTo={'url'} title="Export Data" Icon={ImCloudDownload} />
      <SettingsNavRow navTo={'url'} title="Help" Icon={FaRegularCircleQuestion} />


      {/* <button class="px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Log Out</button> */}
    </div>
  );
};

export default Settings;
