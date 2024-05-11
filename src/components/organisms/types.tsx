
export interface ListProps {
  list: any[]
  RowComponent: any
  filter?: string
  filterKey?: string
};

export interface User {
  email: string
  blockchain_enabled: boolean
}