import { Component, createSignal, Setter } from "solid-js";
// import useTheme from "../../state/actions/theme-actions/theme-actions";

export interface TogglerValue {
  enabled: boolean
  switch: (theme: boolean) => void
  height?: number
}

const Toggler: Component<TogglerValue> = (props) => {
  const height = props.height ? props.height : 8;
  const width = height * 2 * 2 + 8 + 4;
  // double height times 2 to double the length, account for padding and border width
  // const { theme} = useTheme()
  const [toggle, moveToggle] = createSignal(props.enabled);
  const enable = () => {
    const value = toggle() ? false : true
    props.switch(value);
    moveToggle(toggle() ? false : true);
  }

  return (
    <div style={{ width: width + 'px', padding: '4px' }} onClick={enable} 
      class={`cursor-pointer toggle-body rounded-full border-2 border-textLight border-solid dark:border-textDark flex transition-all duration-500 `}>
      <div style={{ padding: height + 'px' }} class={`toggle rounded-full transition-all duration-500 dark:bg-textDark  bg-textLight ${toggle() ? 'translate-x-full ' : ''}`}/>
    </div>);
};


export default Toggler;