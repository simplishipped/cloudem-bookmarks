import { Component, createEffect, on } from "solid-js";
import './checkbox.css';

interface CheckboxProps {
  id: string
  row?: () => any
  check: (...args: any[]) => void;
  checked?: () => boolean
}

const Checkbox: Component<CheckboxProps> = (props) => {
  const handleCheck = () => {
    if (props.row) {
      props.check(props.row().id, props.checked ? false : true, props.row);
    } else {
      //@ts-ignore
      props.check(props.checked() ? false : true);
    }

  };
  //@ts-ignore
  createEffect(on(props.row ? props.row : props.checked, () => {
  }, { defer: true }))

  // createEffect(on(props.row, () => {
  // }, { defer: true }))


  return (
    <div class="checkbox-wrapper" style={{ 'margin-top': '-6px' }}>
      { /*@ts-ignore*/}
      <input onChange={handleCheck} checked={props.row ? props.row().checked : props.checked()} id={'cbx' + props.id} type="checkbox" />

      <label class="cbx border-2 dark:border-textDark border-textLight" for={'cbx' + props.id}></label>
    </div>
  );
};

export default Checkbox;