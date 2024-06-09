import type { Request } from 'express'
import { z } from 'zod'

export const getParamsId = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type GetParamsIdRequest = Request<z.infer<typeof getParamsId>['params']>
