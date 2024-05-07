import { Component, createEffect } from "solid-js";
import {
  FaSolidNetworkWired,
  FaRegularMoon,
  FaSolidSun,
  FaRegularCircleQuestion} from "solid-icons/fa";
import {} from "solid-icons/fa";
import useTheme from "../../../actions/theme-actions/theme-actions";
import SettingsNavRow from "../../molecules/settings-nav-row";
import SettingsBoolRow from "../../molecules/settings-bool-row";

const Settings: Component<{}> = (props) => {
  const {theme, setTheme} = useTheme();
  return (
    <div class={`text-textLight dark:text-textDark px-6 pt-2 transition-colors`}>
      <SettingsBoolRow IconTrue={FaRegularMoon} IconFalse={FaSolidSun} title="Theme" setter={setTheme} value={theme} />
      <SettingsNavRow navTo={"/account/networks"} title="Network" Icon={FaSolidNetworkWired}/>
      <SettingsNavRow navTo={'url'} title="Help" Icon={FaRegularCircleQuestion} />
    </div>
  );
};

export default Settings;
