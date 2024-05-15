import { Component, For, Index, JSXElement, Show, createEffect, createSignal, on, onMount } from "solid-js";
import { Dynamic } from "solid-js/web"
import { FaRegularFaceSadTear } from 'solid-icons/fa'
import { Bookmark } from "../molecules/types";
import useContent from "../../state/actions/content-actions";
export interface ListProps {
  list: any[]
  RowComponent: any
  filter: () => string
  filterKey: string
  search: () => string
  hasCheckboxes?: boolean
};

export const RowList: Component<ListProps> = (props) => {

  const [rows, setRows]: [() => JSXElement[], (rows: Bookmark[]) => void] = createSignal([]);
  const contentProps = useContent()

  function filterRows() {
    const list = props.list.filter(
      (row) => row[props.filterKey].toLowerCase() === props.filter()?.toLowerCase() && (row.name.toLowerCase().includes(props.search().toLowerCase()) || row.url.toLowerCase().includes(props.search().toLocaleLowerCase())));

    return list;
  }

  createEffect(on([props.search, props.filter], (a, b) => {
    const list = filterRows();
    setRows(list)
  }, { defer: true }));

  onMount(() => {
    const list = filterRows()
    setRows(list)
  })

  createEffect(on(contentProps.bookmarksChecked, () => {
    if (props.hasCheckboxes) {
      const list = filterRows()
      setRows(list)
    }
  }, { defer: true }))



  return (
    <div class={`${props.list.length > 6 ? 'overflow-y-scroll' : ''} scroller-height pb-20`}>
      <Show when={rows().length > 0} fallback={
        <div class="flex flex-col items-center justify-center h-full">
          <FaRegularFaceSadTear class="w-16 h-16 text-primaryButtonLight dark:text-primaryButtonDark dark:fill-textDark fill-textLight" />
          <p class="text-textLight dark:text-textDark text-lg mt-2">No results found.</p>
        </div>}>
        <Index each={rows()}>
          {(row) => {
            return (
              <Dynamic component={props.RowComponent} row={row()} />
            )
          }
          }
        </Index>
      </Show>


    </div>
  );
};
