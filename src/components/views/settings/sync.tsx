import { Component, createSignal, Show } from "solid-js";
import Button from "../../atoms/button";
import useSettings from "../../../state/actions/settings-actions";
import useContent from "../../../state/actions/content-actions";
import Checkbox from "../../atoms/checkbox/checkbox";
import Loader from "../../atoms/loader/loader";
interface Props {

}

const Sync: Component<Props> = ({ }) => {
  const settings = useSettings();
  const content = useContent();
  
  const [loadingFromBrowser, setLoadingFromBrowser] = createSignal(false);
  const [loadingToBrowser, setLoadingToBrowser] = createSignal(false);



  const syncFromBrowser = async () => {
    setLoadingFromBrowser(true);
    await content.syncBookmarksFromBrowser();
    setLoadingFromBrowser(false);
  }

  const syncToBrowser = async () => {
    setLoadingToBrowser(true);
    await content.syncDatabaseToBrowser();
    setLoadingToBrowser(false);
  }

  return (
    <div class="px-4">
      <div class="shadow-xl p-2 rounded-md">
        <div class="flex items-center">


        </div>
        <Show when={loadingFromBrowser()} fallback={<Button func={syncFromBrowser} title="From Browser" />}>
          <div class="flex justify-center"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
        </Show>

        <Show when={loadingToBrowser()} fallback={<Button func={syncToBrowser} title="To Browser" />}>
          <div class="flex justify-center"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
        </Show>
      </div>
    </div>
  )

};

export default Sync

