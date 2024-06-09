import type { Request, Response } from 'express'
import { z } from 'zod'

import { Book, Genre, Reading_List, book } from 'types/db'

export type ResponseBook = Response<Book>

export type GetBooksByAccountIdReturn = Book & {
  genre: Genre['name']
  status?: Reading_List['status']
}
export type GetBooksByAccountIdResponse = Response<GetBooksByAccountIdReturn[]>

export const createBook = z.object({
  body: book.omit({ id: true, created_at: true }),
})
export type CreateBook = z.infer<typeof createBook>['body']
export type CreateBookRequest = Request<CreateBook>

export const createBooks = z.object({
  body: book.omit({ id: true, created_at: true }).array(),
})
export type CreateBooksRequest = Request<z.infer<typeof createBooks>['body']>

export const deleteBooksByIds = z.object({
  body: z.array(z.number()),
})
export type DeleteBooksByIdsRequest = Request<
  z.infer<typeof deleteBooksByIds>['body']
>
