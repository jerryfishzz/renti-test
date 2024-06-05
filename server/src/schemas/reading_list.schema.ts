import { z } from 'zod'
import type { Request, Response } from 'express'

import { Book, Genre, Reading_List } from 'types/db'

export const getByUserId = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type GetByUserIdRequest = Request<z.infer<typeof getByUserId>['params']>
export type GetByUserIdReturn = Book &
  Pick<Reading_List, 'status'> & { genre: Genre['name'] }
export type GetByUserIdResponse = Response<GetByUserIdReturn[]>
