import { Component, createSignal } from "solid-js";
import { RiArrowsArrowDropDownFill } from "solid-icons/ri";

interface Choice {
  label: string,
  value: string
}
interface SelectProps {
  options: Choice[],
  name: string,
  value: string,
  setValue: (value: string) => void
  color?: string
}

const Select: Component<SelectProps> = (props) => {

  const [showChoices, setShowChoices] = createSignal(false);

  const makeChoice = (value: string) => {
    props.setValue(value)
    setShowChoices(false);
  }


  let ChoiceElement = (value: string, label: string) => {
    return <div onClick={() => makeChoice(value)}
      class="hover:bg-primaryLight select-none dark:hover:bg-primaryDark cursor-pointer rounded-md dark:border-textDark text-textLight dark:text-textDark border-textLight border-2 px-2 py-1 mt-2 w-full">{label}</div>
  }

  let choicesMap =
    <div style={{ height: 'calc(100vh - 230px)', 'z-index': 50 }} class="absolute flex-col overflow-auto w-10/12 px-3 ml-2 pb-3 mt-2 rounded-md dark:bg-secondaryDark bg-secondaryLight border-textLight dark:border-textDark text-textLight dark:text-textDark border-2">
      {props.options.map((choice: any) => {
        return ChoiceElement(choice.value, choice.label)
      })}
    </div>


  return (
    <>
      <div onClick={() => setShowChoices(showChoices() ? false : true)} class="select-none relative mt-2 border-textLight dark:border-textDark text-textLight dark:text-textDark border-2 p-2 flex justify-center rounded-md cursor-pointer">
        {!props.value ? 'Category' : props.value}
        <RiArrowsArrowDropDownFill size={30} class="absolute right-2 top-1/2 -translate-y-1/2 z-0" />
      </div>
      {showChoices() ? choicesMap : false}

    </>

  )
};

export default Select;