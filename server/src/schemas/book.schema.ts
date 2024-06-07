import type { Request, Response } from 'express'
import { z } from 'zod'

import { Book, Genre, Reading_List, book } from 'types/db'

export const getBooksByAccountId = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type GetBooksByAccountIdRequest = Request<
  z.infer<typeof getBooksByAccountId>['params']
>
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
export type CreateBookResponse = Response<Book>

export const createBooks = z.object({
  body: book.omit({ id: true, created_at: true }).array(),
})
export type CreateBooksRequest = Request<z.infer<typeof createBooks>['body']>
