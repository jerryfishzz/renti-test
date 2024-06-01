import { z } from 'zod'

export const account = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  email: z.string(),
  name: z.string().nullable(),
  reading_preferences: z.string(), // JSON stringified array of strings
})
export type Account = z.infer<typeof account>

export type Genre = {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
