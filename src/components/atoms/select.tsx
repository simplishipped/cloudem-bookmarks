import { Component, createEffect, createSignal, on, onMount, Show } from "solid-js";
import { RiArrowsArrowDropDownFill } from "solid-icons/ri";
import { SelectChoice } from "../../types/types";
import capitalizeFirstLetter from "../../util/capitalize-word";
import { OcTrash2 } from 'solid-icons/oc'
import { FaSolidPlus } from 'solid-icons/fa';
import { IoCloseOutline } from 'solid-icons/io'


interface SelectProps {
  options: () => any[],
  name: string,
  value: () => string,
  setValue: (value: string) => void
  color?: string,
  loading?: boolean,
  deleteOp?: (collection: any) => Promise<void>
  enablePlus?: boolean,
  setParentValueId?: (id: number | undefined) => void
  collectionParentId?: () => number | undefined
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

  const createSubCollection = (value: any) => {
    if (props.setParentValueId) {
      props.setValue(value.name);
      setSearch(capitalizeFirstLetter(value.name) + ' > ');
      props.setParentValueId(value.id)
      input.focus();
    }
  }
  const cancelSubCollection = (value: any) => {
    if(props.setParentValueId) {
      props.setParentValueId(undefined);
      props.setValue('');
      setSearch('');
      input.focus();
    }
  }

  let ChoiceElement = (choice: any, index: number) => {
    return (
      <div
        class="dark:hover:text-secondaryButtonDark btn-hover-one deep-hover-transition-two  select-none  cursor-pointer rounded-lg text-textLight dark:text-textDark  mt-2 w-full flex items-center justify-between" style={{ padding: '8px 8px 10px 8px' }}>
        <div onClick={() => makeChoice(choice)} class="w-5/6">{capitalizeFirstLetter(choice.name)}</div>
        <Show when={props.deleteOp}>
          <OcTrash2 onClick={() => props.deleteOp && props.deleteOp(choice)} size="18" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
        </Show>
        <Show when={!props.deleteOp}>
          <button onClick={() => createSubCollection(choice)} title="New Folder" >
            <FaSolidPlus size="18" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
          </button>
        </Show>
      </div>
    )
  }

  let choicesMap =
    <div style={{ height: 'calc(100vh - 230px)', 'z-index': 50, transform: 'translateX(-50%)' }}
      class="left-1/2 absolute bg-primaryLight dark:bg-secondaryDark flex-col overflow-auto w-11/12 px-3 pb-3 mt-2 rounded-md shadow-lg dark:border-textDark text-textLight dark:text-textDark">
      {choices().map((choice: any, ind: number) => {
        return ChoiceElement(choice, ind)
      })}
    </div>

  let onEnter = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      makeChoice({ name: search() });
    } else if (e.key === 'ArrowDown') {

    } else if (e.key === 'ArrowUp') {

    } else {
      if (e.key === 'Backspace' && search().includes('>')) {
        let lastCharacterIsArrow = search().slice(search().length - 3, search().length - 1) === ' >';
        if (lastCharacterIsArrow) {
          e.preventDefault()
        }
      }
    }
  }

  return (
    <>
      <div onClick={showOptions} class="select-none relative mt-2 shadow  text-textLight dark:text-textDark p-2 flex justify-center rounded-md cursor-pointer ">
        <input ref={input} onKeyDown={onEnter} onInput={(e) => setSearch(e.target.value)} class={`${showChoices() ? '' : 'text-transparent'} border-0 bg-transparent w-full active:border-0 focus:border-0 pl-2 text-center outline-none`} value={search()} type="text" />
        <Show when={!showChoices()}>
          <div style={{ 'margin-left': '6.5px' }} class="absolute">{capitalizeFirstLetter(props.value())}</div>
        </Show>
        
        <Show when={props.collectionParentId !== undefined}>
          {props.collectionParentId && props.collectionParentId() ? <IoCloseOutline onClick={cancelSubCollection} size={20} class="absolute right-10 top-1/2 -translate-y-1/2 z-0 cursor-pointer" /> : false}

        </Show>
        <RiArrowsArrowDropDownFill size={30} class="absolute right-2 top-1/2 -translate-y-1/2 z-0" />
      </div>
      {showChoices() ? choicesMap : false}

    </>

  )
};

export default Select;