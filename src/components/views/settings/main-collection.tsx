import { Component, createSignal, createEffect } from "solid-js";
import Input from "../../atoms/input";
import useContent from "../../../state/actions/content-actions";
import { on, Show } from "solid-js";
import { IoChevronBack } from 'solid-icons/io';
import { TbSubtask } from 'solid-icons/tb'
import capitalizeFirstLetter from "../../../util/capitalize-word";
import sortByKey from "../../../util/sortByKey";
import useSettings from "../../../state/actions/settings-actions";
import { Collection } from "../../../types/types";

const MainCollection: Component<{ options: () => Collection[] }> = (props) => {
  const [search, setSearch] = createSignal("");
  const [selectedPath, setSelectedPath] = createSignal<string[]>([]);

  const content = useContent();
  const settings = useSettings();
  const [choices, setChoices] = createSignal(sortByKey(content.collections().slice(0), 'name'));



  const makeChoice = (value: any) => {
    settings.setMainCollection(value);
  }

  const lookIntoSubCollection = (value: any) => {
    setSelectedPath([...selectedPath(), value.name]);
    filterChoices();
  }

  const filterChoices = () => {
    try {
      const path = selectedPath();

      let currentChoices = content.collections();
      path.forEach((name) => {
        const foundChoice = currentChoices.find((choice: any) => choice.name === name);

        if (foundChoice && foundChoice.children) {
          currentChoices = foundChoice.children;
        }
      });

      const filteredChoices = currentChoices.filter((choice: any) =>
        choice.name.toLowerCase().includes(search().toLowerCase())
      );

      setChoices(sortByKey(filteredChoices, 'name'));
    } catch (err) {
      console.log(err)
    }

  };

  const goBack = () => {
    const path = selectedPath();
    path.pop();
    setSelectedPath([...path]);
    filterChoices();
  }

  const ChoiceElement = (choice: any, index: number) => {

    return (
      <button
        tabIndex={2}
        class={`${settings.mainCollection() &&settings.mainCollection().id === choice.id ? 'bg-primaryButtonLight dark:bg-primaryButtonDark' : ''}
         ${settings.mainCollection() &&settings.mainCollection().id === choice.id ? '' : 'dark:hover:text-secondaryButtonDark '} btn-hover-one deep-hover-transition-two 
    select-none cursor-pointer rounded-lg text-textLight dark:text-textDark mt-2 w-full flex items-center justify-between text-left`}
        style={{ padding: '0px 8px 0px 8px' }}>
        <div style={{ padding: '8px 0px 10px 0px' }} onClick={() => makeChoice(choice)} class={`w-5/6 `}>
          {capitalizeFirstLetter(choice.name)} {choice.children && choice.children.length > 0 ? `(${choice.children.length})` : ""}
        </div>
        <Show when={choice.children && choice.children.length > 0}>
          <button class=" p-2" onClick={() => lookIntoSubCollection(choice)} title="Sub Collections" >
            <TbSubtask size="20" class={`text-primaryButtonLight dark:text-primaryButtonDark dark:hover:text-textDark hover:text-textLight
              ${settings.mainCollection() &&settings.mainCollection().id === choice.id  ? 'dark:text-textDark' : 'text-textLight'}`} />
          </button>
        </Show>
      </button>

    )
  }

  const choicesMap = (
    <div>
      {choices().map((choice: any, ind: number) => {
        return ChoiceElement(choice, ind)
      })}
    </div>
  );

  createEffect(on([search, selectedPath], filterChoices));
  createEffect(on(content.collections, filterChoices));

  return (
    <div class="px-4 relative">
      <div class={selectedPath().length > 0 ? `pl-6 ml-4` : ''}>
        <Input value={search} setValue={setSearch} placeholder="Search" />
      </div>
      <Show when={selectedPath().length > 0}>
        <button style={{ "z-index": '1000' }} class=" p-2 absolute left-4 top-0 transform -translate-x-full-translate-y-1/2" onClick={goBack} title="Go back">
          <IoChevronBack size="20" class=" text-textLight dark:text-textDark " />
        </button>
      </Show>
      <div class={`${content.collections().length > 8 ? 'overflow-y-scroll' : ''} scroller-height pb-20 relative`}>

        {choicesMap}
      </div>
    </div>
  );
};

export default MainCollection;