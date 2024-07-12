import { z } from 'zod'

export const account = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  email: z.string(),
  name: z.string().nullable(),
  reading_preferences: z.array(z.string()),
})
export type Account = z.infer<typeof account>

export type Genre = {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}

export const book = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  genre_id: z.number(),
  created_at: z.date(),
  cover_image: z.string(),
})
export type Book = z.infer<typeof book>

export const reading_list = z.object({
  id: z.number(),
  account_id: z.number(),
  book_id: z.number(),
  status: z.enum(['currently reading', 'read', 'want to read']),
  created_at: z.date(),
  updated_at: z.date(),
})
export type Reading_List = z.infer<typeof reading_list>

export const session = z.object({
  id: z.number(),
  account_id: z.number(),
  refresh_token: z.string(),
  user_agent: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})
export type Session = z.infer<typeof session>
