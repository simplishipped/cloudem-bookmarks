import { Component, For, Show } from "solid-js";
import { ListProps } from "./types";


export const BoxList: Component<ListProps> = (props) => {
  console.log('WTF', props.list)
  return (
    <div class={`${props.list.length > 6 ? 'overflow-y-scroll' : ''} scroller-height pb-20 flex flex-wrap w-full content-start gap-1`}>
      <For each={props.list}>
        {(row) =>
          <Show when={row.CATEGORY.toLowerCase() === props.category.toLowerCase()}>
            <props.RowComponent width="calc(50% - 0.25rem)" {...row} />
          </Show>
          }
      </For>
    </div>
  );
};
