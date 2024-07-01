import { Component, createSignal } from "solid-js";
import Button from "../../atoms/button";
import useSettings from "../../../state/actions/settings-actions";
import useContent from "../../../state/actions/content-actions";
import Checkbox from "../../atoms/checkbox/checkbox";
interface Props {

}

const Sync: Component<Props> = ({ }) => {
  const settings = useSettings();
  const content = useContent();
  const [removeOtherBookmarks, setRemoveOtherBookmarks] = createSignal(false)


  const syncFromBrowser = () => {
    content.syncBookmarksToDatabase({removeOtherBookmarks: removeOtherBookmarks()})
  }

  return (
    <div class="px-4">
      <div class="shadow-xl p-2 rounded-md">
        <div class="flex items-center">
          <div class="ml-2"><Checkbox id="holy-moly" checked={removeOtherBookmarks} check={setRemoveOtherBookmarks} /></div>
          <div class="text-textLight dark:text-textDark ml-2">Remove chrome's "Other bookmarks" </div>
        </div>
        <Button func={syncFromBrowser} title="From Browser" />

      </div>

      <div class="shadow-xl p-2 rounded-md">
        <div class="flex items-center">
          <label for="import-btn" class="cursor-pointer inline-block px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
  font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">To Browser</label>
          <input id="import-btn" class="hidden" onChange={settings.importBookmarks} type="file" />
        </div>
      </div>

    </div>
  )

};

export default Sync

