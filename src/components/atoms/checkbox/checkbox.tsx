import { Component } from "solid-js";
import './checkbox.css';
import { Bookmark } from "../../molecules/types";


interface CheckboxProps {
  row: Bookmark
  check: (id: number| undefined, checked: boolean) => void;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  const handleCheck = () => { 
    props.check(props.row.id, !props.row.checked);
  };
  return (
    <div class="checkbox-wrapper -mt-1">
      <input onChange={handleCheck} checked={props.row.checked} id={'cbx'+props.row.id} type="checkbox" />
      <label class="cbx border-2 dark:border-textDark" for={'cbx'+props.row.id}></label>
    </div>
  );
};

export default Checkbox;