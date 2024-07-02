import { Component, createEffect, createSignal, on, Show } from "solid-js";
import { RiArrowsArrowDropDownFill } from "solid-icons/ri";
import capitalizeFirstLetter from "../../util/capitalize-word";
import { OcTrash2 } from 'solid-icons/oc';
import { FaSolidPlus } from 'solid-icons/fa';
import { IoCloseOutline } from 'solid-icons/io';
import { IoChevronBack } from 'solid-icons/io';
import { TbSubtask } from 'solid-icons/tb'
import useContent from "../../state/actions/content-actions";

interface SelectProps {
  options: () => any[],
  name: string,
  value: () => string,
  setValue: (value: string) => void
  color?: string,
  loading?: boolean,
  deleteOp?: (collection: any) => Promise<boolean>
  enablePlus?: boolean,
  setParentValueId?: (id: number | undefined) => void
  collectionParentId?: number | undefined
}

const SubChoicesSelect: Component<SelectProps> = (props) => {
  const [showChoices, setShowChoices] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [choices, setChoices] = createSignal(props.options());
  const [selectedPath, setSelectedPath] = createSignal<string[]>([]);
  const [focusedChoice, setFocusedChoice] = createSignal<number>();
  const contentProps = useContent();
  let input: any;

  const makeChoice = (value: any) => {
    props.setValue(value.name);
    setShowChoices(false);
    // if (value.children && value.children.length > 0) {
    //   setSelectedPath([...selectedPath(), value.name]);
    //   filterChoices();
    // } else {
    //   props.setValue(value.name);
    //   setShowChoices(false);
    //   // setSelectedPath([]);
    // }
  }

  const lookIntoSubCollection = (value: any) => {
    setSelectedPath([...selectedPath(), value.name]);
    filterChoices();
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
    //@ts-ignore
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

  const deleteCollection = async (choice: any) => {
    if (props.deleteOp) {
      setShowChoices(false);
      let done = await props.deleteOp(choice);
      console.log(props.value(), choice.name, selectedPath());
      if (done && props.value() === choice.name && selectedPath().length > 1) {
        props.setValue(selectedPath()[selectedPath().length - 2]);
      } else {
        props.setValue('default');
      }
    }
  }


  const onEnter = (e: any) => {
    const options = props.options();
    const focusedChoiceIndex = options.findIndex(option => option.id === focusedChoice);
    if (e.key === 'Enter' || e.key === 'Tab') {
      makeChoice({ name: search() });
    } else if (e.key === 'ArrowDown') {
      let nextIndex = (focusedChoiceIndex + 1) % options.length;
      let nextId = options[nextIndex].id;
      setFocusedChoice(nextId);
    } else if (e.key === 'ArrowUp') {
      let prevIndex = (focusedChoiceIndex - 1 + options.length) % options.length;
      let prevId = options[prevIndex].id;
      setFocusedChoice(prevId);
    } else {
      if (e.key === 'Backspace' && search().includes('>')) {
        let lastCharacterIsArrow = search().slice(search().length - 3, search().length - 1) === ' >';
        if (lastCharacterIsArrow) {
          e.preventDefault();
        }
      }
    }
  }


  const ChoiceElement = (choice: any, index: number) => {
    return (
      <button
        tabIndex={2}
        class={`${choice.id === focusedChoice() ? 'active-btn' : ''} dark:hover:text-secondaryButtonDark btn-hover-one deep-hover-transition-two 
    select-none cursor-pointer rounded-lg text-textLight dark:text-textDark mt-2 w-full flex items-center justify-between text-left`}
        style={{ padding: '0px 8px 0px 8px' }}>
        <div style={{ padding: '8px 0px 10px 0px' }} onClick={() => makeChoice(choice)} class={`w-5/6 ${choice.id === focusedChoice() ? 'translate-x-3 transition-transform' : ''}`}>
          {capitalizeFirstLetter(choice.name)} {choice.children && choice.children.length > 0 ? `(${choice.children.length})` : ""}
        </div>
        <Show when={choice.children && choice.children.length > 0}>
          <button class=" p-2" onClick={() => lookIntoSubCollection(choice)} title="Sub Collections" >
            <TbSubtask size="20" class="text-primaryButtonLight dark:text-primaryButtonDark dark:hover:text-textDark hover:text-textLight" />
          </button>
        </Show>
        <Show when={props.deleteOp}>
          <button class=" p-2" onClick={() => contentProps.setConfirmedAction(() => deleteCollection(choice))} title="Delete Collection" >
            <OcTrash2 size="18" class="dark:hover:fill-textDark hover:fill-textLight fill-primaryButtonLight dark:fill-primaryButtonDark" />
          </button>

        </Show>

        <Show when={!props.deleteOp && choice.children}>
          <button onClick={() => createSubCollection(choice)} title="New Sub Collection" >
            <FaSolidPlus size="18" class="fill-primaryButtonLight dark:fill-primaryButtonDark dark:hover:fill-textDark hover:fill-textLight" />
          </button>
        </Show>

      </button>

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


  return (
    <>
      <div onClick={showOptions} class="select-none relative mt-2 shadow text-textLight dark:text-textDark p-2 flex justify-center rounded-md cursor-pointer ">
        <Show when={selectedPath().length > 0 && showChoices()}>
          <button class=" p-2 absolute left-8 transform -translate-x-full top-1/2 -translate-y-1/2" onClick={goBack} title="Go back">
            <IoChevronBack  size="20" class=" fill-primaryButtonLight dark:fill-primaryButtonDark" />
          </button>
        </Show>
        <input ref={input} onKeyDown={onEnter} onInput={(e) => setSearch(e.target.value)} class={`${showChoices() ? '' : 'text-transparent'} 
        border-0 bg-transparent w-full active:border-0 focus:border-0 pl-2 text-center outline-none`} value={search()} type="text" />
        <Show when={!showChoices()}>
          <div style={{ 'margin-left': '6.5px' }} class="absolute">{capitalizeFirstLetter(props.value())}</div>
        </Show>
        <Show when={props.collectionParentId !== undefined}>
          {/*@ts-ignore */}
          {props.collectionParentId() ? <IoCloseOutline onClick={cancelSubCollection} size={20} class="absolute right-10 top-1/2 -translate-y-1/2 z-0 cursor-pointer" /> : false}
        </Show>
        <RiArrowsArrowDropDownFill size={30} class="absolute right-2 top-1/2 -translate-y-1/2 z-0" />
      </div>
      {showChoices() ? choicesMap : false}
    </>
  )
};

export default SubChoicesSelect;
