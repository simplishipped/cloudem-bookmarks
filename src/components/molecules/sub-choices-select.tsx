import { Component, createEffect, createSignal, on, Show } from "solid-js";
import { RiArrowsArrowDropDownFill } from "solid-icons/ri";
import capitalizeFirstLetter from "../../util/capitalize-word";
import { OcTrash2 } from 'solid-icons/oc';
import { FaSolidPlus } from 'solid-icons/fa';
import { IoCloseOutline } from 'solid-icons/io';
import { IoChevronBack } from 'solid-icons/io'

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
  collectionParentId?: number | undefined
}

const SubChoicesSelect: Component<SelectProps> = (props) => {
  const [showChoices, setShowChoices] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [choices, setChoices] = createSignal(props.options());
  const [selectedPath, setSelectedPath] = createSignal<string[]>([]);
  let input: any;

  const makeChoice = (value: any) => {
    if(value.children && value.children.length > 0) {
      setSelectedPath([...selectedPath(), value.name]);
      filterChoices();
    } else {
      props.setValue(value.name);
      setShowChoices(false);
      // setSelectedPath([]);
    }
    }
 

  const showOptions = () => {
    setShowChoices(!showChoices());
    if (showChoices()) {
      input.focus();
    } else {
      input.blur();
    }
  }

  const filterChoices = () => {
    const path = selectedPath();
    let currentChoices = props.options();

    path.forEach((name) => {
      const foundChoice = currentChoices.find((choice: any) => choice.name === name);
      if (foundChoice && foundChoice.children) {
        currentChoices = foundChoice.children;
      }
    });

    const filteredChoices = currentChoices.filter((choice: any) => 
      choice.name.toLowerCase().includes(search().toLowerCase())
    );
    
    setChoices(filteredChoices);
  }

  createEffect(on([search, selectedPath], filterChoices));
  createEffect(on(props.options, filterChoices));

  const createSubCollection = (value: any) => {
    props.setValue(value.name);
    setSearch(capitalizeFirstLetter(value.name) + ' > ');
    props.setParentValueId(value.id)
    input.focus();
    // if (value.children.length > 0) {
    //   setSelectedPath([...selectedPath(), value.name]);
    //   filterChoices();
    //   input.focus();
    // } else {
    //   props.setValue(value.name);
    //   setSearch(capitalizeFirstLetter(value.name) + ' > ');
    //   props.setParentValueId(value.id)
    //   input.focus();
    // }
  }

  const cancelSubCollection = () => {
    if (props.setParentValueId) {
      props.setParentValueId(undefined);
      props.setValue('');
      setSearch('');
      setSelectedPath([]);
      setShowChoices(true);
      input.focus();
    }
  }

  const goBack = () => {
    const path = selectedPath();
    path.pop();
    setSelectedPath([...path]);
    filterChoices();
  }

  const deleteCollections = (choice:any) => {
    props.deleteOp && props.deleteOp(choice);

  }

  const ChoiceElement = (choice: any, index: number) => {
    return (
      <div
        class="dark:hover:text-secondaryButtonDark btn-hover-one deep-hover-transition-two select-none cursor-pointer rounded-lg text-textLight dark:text-textDark mt-2 w-full flex items-center justify-between"
        style={{ padding: '8px 8px 10px 8px' }}>
        <div onClick={() => makeChoice(choice)} class="w-5/6">
          {capitalizeFirstLetter(choice.name)} {choice.children.length > 0 ? `(${choice.children.length})` : ""}
        </div>
        <Show when={props.deleteOp}>
          <OcTrash2 onClick={() => props.deleteOp && props.deleteOp(choice)} size="18" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
        </Show>
        <Show when={!props.deleteOp && choice.children}>
          <button onClick={() => createSubCollection(choice)} title="New Sub Collection" >
            <FaSolidPlus size="18" class="fill-primaryButtonLight dark:fill-primaryButtonDark" />
          </button>
        </Show>
      </div>
    )
  }

  const choicesMap = (
    <div style={{ height: 'calc(100vh - 230px)', 'z-index': 50, transform: 'translateX(-50%)' }}
      class="left-1/2 absolute bg-primaryLight dark:bg-secondaryDark flex-col overflow-auto w-11/12 px-3 pb-3 mt-2 rounded-md shadow-lg dark:border-textDark text-textLight dark:text-textDark">
   
      {choices().map((choice: any, ind: number) => {
        return ChoiceElement(choice, ind)
      })}
    </div>
  );

  const onEnter = (e: any) => {
    console.log('wtf', search())
    if (e.key === 'Enter' || e.key === 'Tab') {
      makeChoice({ name: search() });
    } else if (e.key === 'ArrowDown') {

    } else if (e.key === 'ArrowUp') {

    } else {
      if (e.key === 'Backspace' && search().includes('>')) {
        let lastCharacterIsArrow = search().slice(search().length - 3, search().length - 1) === ' >';
        if (lastCharacterIsArrow) {
          e.preventDefault();
        }
      }
    }
  }

  console.log

  return (
    <>
      <div onClick={showOptions} class="select-none relative mt-2 shadow text-textLight dark:text-textDark p-2 flex justify-center rounded-md cursor-pointer ">
      <Show when={selectedPath().length > 0 && showChoices()}>
        <IoChevronBack onClick={goBack} size="20" class="absolute left-8 transform -translate-x-full top-1/2 -translate-y-1/2 fill-primaryButtonLight dark:fill-primaryButtonDark" />
      
      </Show>
        <input ref={input} onKeyDown={onEnter} onInput={(e) => setSearch(e.target.value)} class={`${showChoices() ? '' : 'text-transparent'} border-0 bg-transparent w-full active:border-0 focus:border-0 pl-2 text-center outline-none`} value={search()} type="text" />
        <Show when={!showChoices()}>
          <div style={{ 'margin-left': '6.5px' }} class="absolute">{capitalizeFirstLetter(props.value())}</div>
        </Show>
        <Show when={props.collectionParentId !== undefined}>
          {props.collectionParentId() ? <IoCloseOutline onClick={cancelSubCollection} size={20} class="absolute right-10 top-1/2 -translate-y-1/2 z-0 cursor-pointer" /> : false}
        </Show>
        <RiArrowsArrowDropDownFill size={30} class="absolute right-2 top-1/2 -translate-y-1/2 z-0" />
      </div>
      {showChoices() ? choicesMap : false}
    </>
  )
};

export default SubChoicesSelect;
