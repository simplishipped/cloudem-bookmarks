
export interface User {
  email: string
  blockchain_enabled: boolean,
  id: number | null,
  start_view?: boolean
}

export interface SelectChoice {
  label: string
  value: string
}