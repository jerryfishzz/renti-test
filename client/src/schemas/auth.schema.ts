import { z } from 'zod'

export const loginRequest = z.object({
  username: z.string(),
  password: z.string(),
})
export type LoginRequest = z.infer<typeof loginRequest>

export const loginResponse = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  reading_preferences: z.array(z.string()),
  access_token: z.string(),
})
export type LoginResponse = z.infer<typeof loginResponse>
