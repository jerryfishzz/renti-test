import { z } from 'zod'
import type { Request, Response } from 'express'

import { Session, session } from 'types/db'

export type GetSessionsByAccountIdResponse = Response<Session[]>

// export const getByUsername = z.object({
//   params: account.pick({ username: true }),
// })
// export type GetByUsernameRequest = Request<
//   z.infer<typeof getByUsername>['params']
// >
// export type GetByUsernameResponse = Response<Account>

export const createSession = z.object({
  body: session.omit({ id: true, created_at: true, updated_at: true }),
})
export type CreateSessionRequest = Request<
  unknown,
  unknown,
  z.infer<typeof createSession>['body']
>
export type CreateSessionResponse = Response<Session>

// export const deleteById = z.object({
//   params: z.object({ id: z.coerce.number() }),
// })
// export type DeleteByIdRequest = Request<z.infer<typeof deleteById>['params']>

// export const login = z.object({
//   body: account.pick({ username: true, password: true }),
// })
// export type LoginRequest = Request<
//   unknown,
//   unknown,
//   z.infer<typeof login>['body']
// >
// export type LoginResponse = Response<Account & { access_token: string }>
