import { Component } from "solid-js";
import Button from "../../atoms/button";
import useSettings from "../../../state/actions/settings-actions";
interface Props {

}

const ExportImport: Component<Props> = ({ }) => {
  const settings = useSettings();
  return (
    <div class="px-6">
      <Button func={settings.exportBookmarks} title="Export" />
      <label for="import-btn" class="cursor-pointer inline-block px-4 py-2 dark:border-textDark dark:text-textDark text-textLight dark:bg-primaryButtonDark bg-primaryButtonLight p-2 mt-6
  font-bold w-full items-center rounded-md text-center hover:dark:bg-secondaryButtonDark hover:bg-secondaryButtonLight">Import</label>
      <input id="import-btn" class="hidden" onChange={settings.importBookmarks} type="file"  />
    </div>
  )

};

export default ExportImport

