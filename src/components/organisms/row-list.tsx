import { Component, For, Index, Show } from "solid-js";
import { Dynamic } from "solid-js/web"
import { ListProps } from "./types";

export const RowList: Component<ListProps> = (props) => {

  return (
    <div class={`${props.list.length > 6 ? 'overflow-y-scroll' : ''} scroller-height pb-20`}>
      {props.filter && props.filterKey ?
        <Index each={props.list}>
          {(row) => {
            // @ts-ignore: Unreachable code error
            return (<Show when={row()[props.filterKey].toLowerCase() === props.filter.toLowerCase()}>
              <Dynamic component={props.RowComponent} row={row()}/>
            </Show>)
          }
          }
        </Index>
        :
        <Index each={props.list}>
          {(row) => <Dynamic component={props.RowComponent} row={row()}/>}
        </Index>}
    </div>
  );
};
