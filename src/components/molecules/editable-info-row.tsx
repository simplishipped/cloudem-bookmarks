import { Component, Show } from "solid-js";
import Input from "../atoms/input";

interface Props {
  editMode?: boolean,
  value: () => string,
  setValue: (v: any) => void,
  title: string
}
const EditableInfoRow: Component<Props> = (props) => {



  return (
    <Show when={!props.editMode} fallback={
      <div class="">
        <div class="text-md text-primaryButtonLight dark:text-primaryButtonDark mb-2">{props.title}</div>
        <Input value={props.value} setValue={props.setValue} />
      </div>
    }>
      <div class="">
        <div class="text-md text-primaryButtonLight dark:text-primaryButtonDark">{props.title}</div>
        <div class="text-xl text-textLight dark:text-textDark">{props.value()}</div>
      </div>
    </Show>

  );
};

export default EditableInfoRow;