
export interface Bookmark {
  name: string
  url: string
  id: string
  collection: string
  user_id: string
}

export interface Nftmark {
  name?: string
  bookmarks: Bookmark[]
  id?: string
  collection?: string
  user_id?: string
  chain_addr?: string
}
