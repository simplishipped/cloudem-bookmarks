import { Component } from "solid-js";
import Button from "../../atoms/button";
import useSettings from "../../../state/actions/settings-actions";
import syncBookmarks from "../../../util/syncFromBrowser";
import useContent from "../../../state/actions/content-actions";
interface Props {

}

const Sync: Component<Props> = ({ }) => {
  const settings = useSettings();
  const content = useContent();

  const syncBks = () => {
    syncBookmarks().then(organizedBookmarks => {
      console.log(organizedBookmarks);
    }).catch(error => {
      console.error(error);
    });
  }

  const syncFromBrowser = () => {
    content.syncBookmarksToDatabase()
  }
  
  return (
    <div class="px-4">
      <Button func={syncFromBrowser} title="From Browser" />
      <label for="import-btn" class="cursor-pointer inline-block px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
  font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">To Browser</label>
      <input id="import-btn" class="hidden" onChange={settings.importBookmarks} type="file"  />
    </div>
  )

};

export default Sync

