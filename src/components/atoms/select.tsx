import { Component, createEffect, createSignal, on, onMount, Show } from "solid-js";
import { RiArrowsArrowDropDownFill } from "solid-icons/ri";
import { SelectChoice } from "../organisms/types";
import capitalizeFirstLetter from "../../util/capitalize-word";

interface SelectProps {
  options: () => string[],
  name: string,
  value: () => string,
  setValue: (value: string) => void
  color?: string,
  loading?: boolean,
}

const Select: Component<SelectProps> = (props) => {

  const [showChoices, setShowChoices] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [choices, setChoices] = createSignal(props.options());
  let input: any;

  const makeChoice = (value: string) => {
    props.setValue(value)
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
      return choice.toLowerCase().includes(search().toLowerCase())
    })
    setChoices(filteredChoices)
  }))
  
 
  createEffect(on(props.options, () => {
    let filteredChoices = props.options().filter((choice: any) => {
      return choice.toLowerCase().includes(search().toLowerCase())
    })
    setChoices(filteredChoices)
  }))

  let ChoiceElement = (value: string) => {
    return (
      <div onClick={() => makeChoice(value)}
        class="hover:bg-primaryLight select-none dark:hover:bg-primaryDark cursor-pointer rounded-md dark:border-textDark text-textLight dark:text-textDark border-textLight border-2  mt-2 w-full" style={{ padding: '8px 8px 10px 8px' }}>
        {capitalizeFirstLetter(value)}
      </div>
    )
  }

  let choicesMap =
    <div style={{ height: 'calc(100vh - 230px)', 'z-index': 50, transform: 'translateX(-50%)' }} class="left-1/2 absolute flex-col overflow-auto w-10/12 px-3 pb-3 mt-2 rounded-md dark:bg-secondaryDark bg-secondaryLight border-textLight dark:border-textDark text-textLight dark:text-textDark border-2">
      {choices().map((choice: string) => {
        return ChoiceElement(choice)
      })}
    </div>

  let onEnter = (e: any) => {
    if (e.key === 'Enter') {
      makeChoice(search());
    }
  }

  return (
    <>
      <div onClick={showOptions} class="select-none relative mt-2 border-textLight dark:border-textDark text-textLight dark:text-textDark border-2 p-2 flex justify-center rounded-md cursor-pointer ">
        <input ref={input} onKeyUp={onEnter} onInput={(e) => setSearch(e.target.value)} class={`${showChoices() ? '' : 'text-transparent'} border-0 bg-transparent w-full active:border-0 focus:border-0 pl-2 text-center outline-none`} value={search()} type="text" />
        <Show when={!showChoices()}>
          <div style={{'margin-left': '6.5px'}} class="absolute">{capitalizeFirstLetter(props.value())}</div>
        </Show>

        <RiArrowsArrowDropDownFill size={30} class="absolute right-2 top-1/2 -translate-y-1/2 z-0" />
      </div>
      {showChoices() ? choicesMap : false}

    </>

  )
};

export default Select;