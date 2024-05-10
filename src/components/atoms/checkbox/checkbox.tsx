import { Component } from "solid-js";
import './checkbox.css';

const Checkbox: Component<{}> = (props) => {

  return (
    <div class="checkbox-wrapper -mt-1">
      <input id="cbx" type="checkbox" />
      <label class="cbx border-2 dark:border-textDark" for="cbx"></label>
    </div>
  );
};

export default Checkbox;