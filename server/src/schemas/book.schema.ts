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
export type CreateBookRequest = Request<z.infer<typeof createBook>['body']>
export type CreateBookResponse = Response<Book>
