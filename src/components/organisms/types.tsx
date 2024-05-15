
export interface ListProps {
  list: any[]
  RowComponent: any
  filter?: string
  filterKey?: string
  search: string
};

export interface User {
  email: string
  blockchain_enabled: boolean,
  id: number | null,
}