import { Component, For, Show } from "solid-js";
import { ListProps } from "./types";


export const RowList: Component<ListProps> = (props) => {
  return (
    <div class={`${props.list.length > 6 ? 'overflow-y-scroll' : ''} scroller-height pb-20`}>
      {props.filter && props.filterKey ?
        <For each={props.list}>
          {(row) => {
            // @ts-ignore: Unreachable code error
            return (<Show when={row[props.filterKey].toLowerCase() === props.filter.toLowerCase()}>
              <props.RowComponent {...row} />
            </Show>)
          }
          }
        </For>
        :
        <For each={props.list}>
          {(row) => <props.RowComponent {...row} />}
        </For>}
    </div>
  );
};
