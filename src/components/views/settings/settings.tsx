import { Component } from "solid-js";
import {
  FaSolidNetworkWired,
  FaRegularMoon,
  FaSolidSun,
  FaRegularCircleQuestion,
  FaSolidListUl
} from "solid-icons/fa";
import { } from "solid-icons/fa";
import useTheme from "../../../state/actions/theme-actions/theme-actions";
import SettingsNavRow from "../../molecules/settings-nav-row";
import SettingsBoolRow from "../../molecules/settings-bool-row";
import { ImCloudDownload } from 'solid-icons/im'
import { AiOutlineBlock } from 'solid-icons/ai'
import { RiMediaPlayListAddFill } from 'solid-icons/ri'
import useSettings from "../../../state/actions/settings-actions/settings-actions";
import useContent from "../../../state/actions/content-actions/content-actions";
// import { ethers } from 'ethers';
// const provider = new ethers.BrowserProvider((window as any).ethereum);


const Settings: Component<{}> = () => {
  const { theme, setTheme } = useTheme();
  const { landingView, setLandingView } = useSettings();
  const props = useContent();

  console.log(props.user())

  return (
    <div onClick={() => console.log(landingView())} class={`text-textLight dark:text-textDark px-6 pt-2 transition-colors`}>
      <SettingsBoolRow IconTrue={FaRegularMoon} IconFalse={FaSolidSun} titles={["Dark Theme", "Light Theme"]} setter={setTheme} value={theme} />
      <SettingsBoolRow IconTrue={FaSolidListUl} IconFalse={RiMediaPlayListAddFill} titles={['Starts App Into Adding', 'Starts App Into List']} setter={setLandingView} value={landingView} />
      <SettingsNavRow navTo={"/account/networks"} title="Network" Icon={FaSolidNetworkWired} />
      <SettingsNavRow navTo={'url'} title="Export Data" Icon={ImCloudDownload} />
      
      <SettingsNavRow navTo={'url'} title="Help" Icon={FaRegularCircleQuestion} />

      
      {/* <button class="px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
        font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Log Out</button> */}
    </div>
  );
};

export default Settings;
