import { Component, createEffect, createSignal, on, onMount, Show } from "solid-js";
import { RiArrowsArrowDropDownFill } from "solid-icons/ri";
import { SelectChoice } from "../../types/types";
import capitalizeFirstLetter from "../../util/capitalize-word";
import { OcTrash2 } from 'solid-icons/oc'


interface SelectProps {
  options: () => any[],
  name: string,
  value: () => string,
  setValue: (value: string) => void
  color?: string,
  loading?: boolean,
  deleteOp?: (collection: any) => Promise<void>
}

const Select: Component<SelectProps> = (props) => {

  const [showChoices, setShowChoices] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [choices, setChoices] = createSignal(props.options());
  let input: any;

  const makeChoice = (value: any) => {
    props.setValue(value.name)
    setShowChoices(false);
  }

  const showOptions = () => {
    setShowChoices(showChoices() ? false : true);
    if (showChoices()) {
      input.focus();
    } else {
      input.blur();
    }
  }
  createEffect(on(search, () => {
    let filteredChoices = props.options().filter((choice: any) => {
      return choice.name.toLowerCase().includes(search().toLowerCase())
    })
    setChoices(filteredChoices)
  }))


  createEffect(on(props.options, () => {
    let filteredChoices = props.options().filter((choice: any) => {
      return choice.name.toLowerCase().includes(search().toLowerCase())
    })
    setChoices(filteredChoices)
  }))

  let ChoiceElement = (choice: any) => {
    return (
      <div
        class="hover:bg-primaryLight select-none dark:hover:bg-primaryDark cursor-pointer rounded-md text-textLight dark:text-textDark  mt-2 w-full flex items-center justify-between" style={{ padding: '8px 8px 10px 8px' }}>
        <div onClick={() => makeChoice(choice)} class="w-5/6">{capitalizeFirstLetter(choice.name)}</div>
        <Show when={props.deleteOp}>
          <OcTrash2 onClick={() => props.deleteOp && props.deleteOp(choice)} size="18" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
        </Show>
      </div>
    )
  }

  let choicesMap =
    <div style={{ height: 'calc(100vh - 230px)', 'z-index': 50, transform: 'translateX(-50%)' }} class="left-1/2 absolute dark:bg-secondaryDark flex-col overflow-auto w-10/12 px-3 pb-3 mt-2 rounded-md shadow-xl dark:border-textDark text-textLight dark:text-textDark">
      {choices().map((choice: any) => {
        return ChoiceElement(choice)
      })}
    </div>

  let onEnter = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      makeChoice({ name: search() });
    }
  }

  return (
    <>
      <div onClick={showOptions} class="inner-shadow select-none relative mt-2 shadow text-textLight dark:text-textDark p-2 flex justify-center rounded-md cursor-pointer ">
        <input ref={input} onKeyDown={onEnter} onInput={(e) => setSearch(e.target.value)} class={`${showChoices() ? '' : 'text-transparent'} border-0 bg-transparent w-full active:border-0 focus:border-0 pl-2 text-center outline-none`} value={search()} type="text" />
        <Show when={!showChoices()}>
          <div style={{ 'margin-left': '6.5px' }} class="absolute">{capitalizeFirstLetter(props.value())}</div>
        </Show>

        <RiArrowsArrowDropDownFill size={30} class="absolute right-2 top-1/2 -translate-y-1/2 z-0" />
      </div>
      {showChoices() ? choicesMap : false}

    </>

  )
};

export default Select;