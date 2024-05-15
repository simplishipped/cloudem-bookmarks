import { Component, For, Index, Show, createEffect, on } from "solid-js";
import { Dynamic } from "solid-js/web"
import { ListProps } from "./types";

export const RowList: Component<ListProps> = (props) => {
  return (
    <div class={`${props.list.length > 6 ? 'overflow-y-scroll' : ''} scroller-height pb-20`}>
      {props.filter && props.filterKey ?
        <Index each={props.list}>
          {(row) => {
            return (
              // @ts-ignore: Unreachable code error
              <Show when={row()[props.filterKey].toLowerCase() === props.filter.toLowerCase() && (row().name.includes(props.search) || row().url.includes(props.search))}>
                <Dynamic component={props.RowComponent} row={row()} />
              </Show>
            )
          }
          }
        </Index>
        :
        <Index each={props.list}>
          {(row) => <Dynamic component={props.RowComponent} row={row()} />}
        </Index>}
    </div>
  );
};
