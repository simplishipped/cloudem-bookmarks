import { Component, Show } from "solid-js";
import {
  FaSolidNetworkWired,
  FaRegularMoon,
  FaSolidSun,
  FaRegularCircleQuestion,
  FaSolidListUl,
  FaSolidUserAstronaut
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
import useCommon from "../../../state/actions/common-actions";
import Error from "../../atoms/error";
import { IoSyncCircleOutline } from 'solid-icons/io'
import { AiFillEye, AiFillEyeInvisible } from 'solid-icons/ai';

const Settings: Component<{}> = () => {
  const { theme, setTheme } = useTheme();
  const settingsProps = useSettings()
  const common = useCommon();


  return (
    <div class={`text-textLight dark:text-textDark px-4 pt-2 transition-colors`}>
      <Show when={common.error().settingsError}>
        <div class=" w-full flex justify-center">
          <Error close={() => common.setError(null, 'settingsError')} error={common.error().settingsError} />
        </div>
      </Show>
      <SettingsNavRow navTo={'/index.html/account/profile'} title="Profile" Icon={FaSolidUserAstronaut} />
      <SettingsBoolRow IconTrue={FaRegularMoon} IconFalse={FaSolidSun} titles={["Dark Theme", "Light Theme"]} setter={setTheme} value={theme} />
      <SettingsBoolRow IconTrue={FaSolidListUl} IconFalse={RiMediaPlayListAddFill} titles={['Start App Into Adding', 'Start App Into List']} setter={settingsProps.setStartView} value={settingsProps.startView} />
      <SettingsBoolRow IconTrue={AiFillEye} IconFalse={AiFillEyeInvisible} titles={['Enable Confirmations', 'Disable Confirmations']} setter={settingsProps.setConfirmationsEnabled} value={settingsProps.confirmationsEnabled} />

      {/* <SettingsBoolRow IconTrue={ImBlocked} IconFalse={AiOutlineBlock} titles={['Enable Blockchain', 'Disable Blockchain']} setter={settingsProps.enableBlockchain} value={settingsProps.blockchainEnabled} /> */}
      {/* <Show when={settingsProps.blockchainEnabled()}>
        <SettingsNavRow navTo={"/account/networks"} title="Network" Icon={FaSolidNetworkWired} />
      </Show> */}
      {/* <SettingsNavRow navTo={'/index.html/account/export-import'} title="Export/Import" Icon={ImCloudDownload} /> */}
      <SettingsNavRow navTo={'/index.html/account/sync'} title="Sync Bookmarks" Icon={IoSyncCircleOutline} />


    </div>
  );
};

export default Settings;
