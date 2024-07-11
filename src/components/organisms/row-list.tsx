import { Component, For, Index, JSXElement, Show, ValidComponent, createEffect, createSignal, on, onMount } from "solid-js";
import { Dynamic } from "solid-js/web"
import { FaRegularFaceSadTear } from 'solid-icons/fa'
import { Bookmark, Collection } from "../../types/types"
import useContent from "../../state/actions/content-actions";
import sortByKey from "../../util/sortByKey";
export interface ListProps {
  list: () => Bookmark[]
  RowComponent: ValidComponent
  filter: () => Collection
  filterKey: string
  search: () => string
  checkedBookmarks?: () => number[]
};

export const RowList: Component<ListProps> = (props) => {
 

  const [rows, setRows]: [() => Bookmark[], (rows: Bookmark[]) => void] = createSignal([]);
  const contentProps = useContent()

  function filterRows(rows: Bookmark[]) {
    const list = rows.filter(
      //@ts-ignore
      (row: Bookmark) => row[props.filterKey] === props.filter().id && (row.name.toLowerCase().includes(props.search().toLowerCase()) || row.url.toLowerCase().includes(props.search().toLocaleLowerCase())));

    return list;
  }

  createEffect(on([props.search, props.filter], (a, b) => {
    const list = filterRows(props.list());
    setRows(sortByKey(list, 'name'))
  }, { defer: true }));

  onMount(() => {
    const list = filterRows(props.list());
    setRows(sortByKey(list, 'name'))
  })

  createEffect(on(contentProps.checkedBookmarks, (bks) => {
    if (props.checkedBookmarks) {
      const list = rows().map((row) => {
        //@ts-ignore
        row.checked = bks.includes(row.id);
        return row
      })
      
      setRows(sortByKey(list, 'name'))
    }
  }, { defer: true }));


  createEffect(on(props.list, (list) => {
    list = filterRows(list);
    setRows(sortByKey(list, 'name'))
  }, { defer: true }));



  return (
    <div class={`${props.list().length > 6 ? 'overflow-y-scroll' : ''} scroller-height pb-20`}>
      <Show when={rows().length > 0} fallback={
        <div class="flex flex-col items-center justify-center h-full">
          <FaRegularFaceSadTear class="w-16 h-16 text-primaryButtonLight dark:text-primaryButtonDark dark:fill-textDark fill-textLight" />
          <p class="text-textLight dark:text-textDark text-lg mt-2">No results found.</p>
        </div>}>
        <Index each={rows()}>
          {(row) => {
            return (
              <Dynamic component={props.RowComponent} row={row} />
            )
          }
          }
        </Index>
      </Show>


    </div>
  );
};
