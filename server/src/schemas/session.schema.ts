import { z } from 'zod'
import type { Request, Response } from 'express'

import { Session, session } from 'types/db'

export type GetSessionByIdResponse = Response<Session>

export type GetSessionsByAccountIdResponse = Response<Session[]>

export const createSession = z.object({
  body: session.omit({ id: true, created_at: true, updated_at: true }),
})
export type CreateSessionRequest = Request<
  any,
  any,
  z.infer<typeof createSession>['body']
>
export type CreateSessionResponse = Response<Session>

export const updateSessionById = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type UpdateSessionByIdRequest = Request<
  z.infer<typeof updateSessionById>['params']
>
export type UpdateSessionByIdResponse = Response<
  Pick<Session, 'id' | 'account_id' | 'user_agent'>
>
