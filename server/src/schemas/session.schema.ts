import { z } from 'zod'
import type { Request, Response } from 'express'

import { Session, session } from 'types/db'

export type GetSessionByIdResponse = Response<Session>

export type GetSessionsByAccountIdResponse = Response<Session[]>

export const getSessionByAccountIdAndUserAgent = z.object({
  params: z.object({ account_id: z.coerce.number(), user_agent: z.string() }),
})
export type GetSessionByAccountIdAndUserAgentRequest = Request<
  z.infer<typeof getSessionByAccountIdAndUserAgent>['params']
>
export type GetSessionByAccountIdAndUserAgentResponse = Response<Session>

export const createSession = z.object({
  body: session.omit({ id: true, created_at: true, updated_at: true }),
})
export type CreateSessionRequest = Request<
  any,
  any,
  z.infer<typeof createSession>['body']
>
export type CreateSessionResponse = Response<Session>
