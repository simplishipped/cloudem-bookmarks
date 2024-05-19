import { Component, onMount } from "solid-js";
import type { Accessor, Setter } from 'solid-js';

interface InputProps {
  placeholder?: string,
  name?: string,
  value: Accessor<string>,
  setValue: (value: string) => void,
  type?: string
  absolute?: boolean
  autofocus?: boolean,
  onBlur?: (e: Event) => void,
}

const Input: Component<InputProps> = ({ name, value, setValue, placeholder, type, absolute, autofocus, onBlur }) => {
  let input: HTMLInputElement;

  onMount(() => {
    if (autofocus) {
      input.focus();

    }
  })
  return (
    //@ts-ignore
    <input ref={input} onBlur={onBlur} autofocus={autofocus} type={type} placeholder={placeholder} class={`${absolute ? 'absolute' : ''} dark:border-textDark border-textLight border-2 border-solid
    dark:bg-primaryDark bg-primaryLight focus:bg-secondaryLight dark:focus:bg-secondaryDark p-2 flex font-bold w-full rounded-md 
    hover:dark:bg-secondaryDark hover:bg-secondaryLight dark:text-textDark text-textLight dark:autofill:bg-primaryDark autofill:bg-primaryLight`} name={name} value={value()} onInput={(e) => setValue((e.target as HTMLInputElement).value)} />
  )
};

export default Input;