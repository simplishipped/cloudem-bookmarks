
export interface User {
  email: string
  blockchain_enabled: boolean,
  id: number,
  start_view?: boolean
}

export interface SelectChoice {
  label: string
  value: string
}

export interface Bookmark {
  name: string
  url: string
  id?: number
  collection: any
  user_id: string
  checked?: boolean,
  favicon?: string
  collection_id?: number,
}

export interface Nftmark {
  name: string
  bookmarks?: any[]
  id: number
  category: string
  user_id: string
  chain_addr?: string,
  image?: any,
  price: number,
  checked?: boolean
}

export interface Collection {
  name: string
  id?: number
  user_id: string
  parent_id?: number
  is_root?: boolean
  has_children?: boolean
}

export interface Log {
  function: string
  api?: string
  error?: any
  user_id?: string,
  user_email?: string
  timestamp?: Date
  timer?: number,
  log_id?: string,
  walletaddr_arb?: string,
}