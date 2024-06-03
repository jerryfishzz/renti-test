import { z } from 'zod'

export const book = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  cover_image: z.string(),
})
export type Book = z.infer<typeof book>

export const getBooksResponse = z.array(book)
export type GetBooksResponse = z.infer<typeof getBooksResponse>
