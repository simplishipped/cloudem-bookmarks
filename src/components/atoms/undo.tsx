import { Component, createSignal, onMount } from "solid-js";

interface Props {
  id: number;
  actionName: string;
  setUndo: (id: number, val: string) => void;
}
const Undo: Component<Props> = (props) => {

  onMount(() => {
    setTimeout(async () => {
      props.setUndo(props.id, '');
    }, 3000)
  });

  const cancel = () => {
    props.setUndo(props.id, '');
  }

  return (
    <div style={{ "z-index": "1100", left: '4' }} class="absolute flex justify-center w-full bottom-14 animate-up">
      <div class="rounded-full w-11/12 py-2 px-4 flex justify-between shadow-lg text-textLight dark:text-textDark dark:bg-primaryButtonDark bg-primaryButtonLight">
        <div>{props.actionName}</div>
        <div onClick={cancel} class="italic font-bold cursor-pointer hover:text-white">Undo</div>
      </div>
    </div>
  );
};

export default Undo;
