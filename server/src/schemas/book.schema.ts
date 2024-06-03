import type { Response } from 'express'
import { z } from 'zod'

import { Book, Genre, Reading_List } from 'types/db'

export const getBooks = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type GetBooksRequest = Response<z.infer<typeof getBooks>['params']>
export type GetBooksReturn = Book & {
  genre: Genre['name']
  status?: Reading_List['status']
}
export type GetBooksResponse = Response<GetBooksReturn[]>
