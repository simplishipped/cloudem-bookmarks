import { Component } from "solid-js";
import type { Accessor, Setter } from 'solid-js';

interface InputProps {
  placeholder?: string,
  name: string,
  value: Accessor<string>,
  setValue: Setter<string>,
  type?: string
}

const Select: Component<InputProps> = ({ name, value, setValue, placeholder, type }) => {
  return (
    <input type={type} placeholder={placeholder} class={`dark:border-textDark border-textLight border-2 border-solid
    dark:bg-primaryDark bg-primaryLight focus:bg-secondaryLight dark:focus:bg-secondaryDark p-2 flex font-bold w-full rounded-md 
    hover:dark:bg-secondaryDark hover:bg-secondaryLight`} name={name} value={value()} onChange={(e) => setValue((e.target as HTMLInputElement).value)}></input>
  )
};

export default Select;