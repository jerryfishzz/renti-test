import { z } from 'zod'

export const book = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  cover_image: z.string(),
})
export type Book = z.infer<typeof book>

const status = z.enum(['currently reading', 'read', 'want to read'])
export type Status = z.infer<typeof status>

export const getBooksResponse = z.array(
  book.merge(z.object({ status: status.optional() })),
)
export type GetBooksResponse = z.infer<typeof getBooksResponse>

export const getMyBooksResponse = z.array(book.merge(z.object({ status })))
