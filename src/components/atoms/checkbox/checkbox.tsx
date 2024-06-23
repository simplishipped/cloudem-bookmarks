import { Component, createEffect, on } from "solid-js";
import './checkbox.css';
import { Bookmark } from "../../../types/types"


interface CheckboxProps {
  row: () => Bookmark
  check: (id: number, checked: boolean, row: any) => void;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  const handleCheck = () => { 
    let checked = props.row().checked ? false : true;
    props.check(props.row().id, checked, props.row);
  };

  createEffect(on(props.row, () => {
  }, { defer: true }))


  return (
    <div class="checkbox-wrapper" style={{'margin-top': '-6px'}}>
      <input onChange={handleCheck} checked={props.row().checked} id={'cbx'+props.row().id} type="checkbox" />
      <label class="cbx border-2 dark:border-textDark border-textLight" for={'cbx'+props.row().id}></label>
    </div>
  );
};

export default Checkbox;