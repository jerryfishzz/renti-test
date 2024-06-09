import { z } from 'zod'
import type { Request, Response } from 'express'

import { Genre } from 'types/db'

export type ResponseGenre = Response<Genre>

export const getById = z.object({ params: z.object({ id: z.coerce.number() }) })
export type GetByIdRequest = Request<z.infer<typeof getById>['params']>
export type GetByIdResponse = ResponseGenre
