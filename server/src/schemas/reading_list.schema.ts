import { z } from 'zod'
import type { Request, Response } from 'express'

import { Reading_List } from 'types/db'

export const getByUserId = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type GetByUserIdRequest = Request<z.infer<typeof getByUserId>['params']>
export type GetByIdResponse = Response<Reading_List[]>
