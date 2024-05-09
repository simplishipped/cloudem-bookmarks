
export interface Bookmark {
  name: string
  url: string
  id?: number
  collection: string
  user_id: number
}

export interface Nftmark {
  name: string
  bookmarks?: any[]
  id?: number
  category: string
  user_id: number
  chain_addr?: string,
  image?: any,
  price: number
}
