
export interface Bookmark {
  name: string
  url: string
  ID?: string,
  CATEGORY?: string
  COLLECTION?: string
  USERID: string,
  IS_COLLECTION?: boolean
}

export interface Nftmark {
  NAME?: string
  BOOKMARKS: Bookmark[]
  ID?: string,
  CATEGORY: string
  USERID?: string,
  CHAIN_ADDR?: string
}
