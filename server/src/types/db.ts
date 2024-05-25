import { z } from 'zod'

export const accountSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  email: z.string(),
  name: z.string().optional(),
  reading_preferences: z.array(z.string()),
})
export type Account = z.infer<typeof accountSchema>

export type Genre = {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
