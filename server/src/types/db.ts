export type Account = {
  id: number
  username: string
  password: string
  created_at: Date
  updated_at: Date
  email: string
  name: string
  reading_preferences: string[]
}

export type Genre = {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
