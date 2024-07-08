import { z } from 'zod'
import type { Request, Response } from 'express'

import { Account, account } from 'types/db'

export const getById = z.object({ params: z.object({ id: z.coerce.number() }) })
export type GetByIdRequest = Request<z.infer<typeof getById>['params']>
export type GetByIdResponse = Response<Account>

export const getByUsername = z.object({
  params: account.pick({ username: true }),
})
export type GetByUsernameRequest = Request<
  z.infer<typeof getByUsername>['params']
>
export type GetByUsernameResponse = Response<Account>

export type GetListResponse = Response<Account[]>

export const createAccount = z.object({
  body: account.omit({ id: true, created_at: true, updated_at: true }),
})
export type CreateAccount = z.infer<typeof createAccount>['body']
export type CreateAccountRequest = Request<unknown, unknown, CreateAccount>
export type CreateAccountResponse = Response<Account>

export const deleteById = z.object({
  params: z.object({ id: z.coerce.number() }),
})
export type DeleteByIdRequest = Request<z.infer<typeof deleteById>['params']>

export const login = z.object({
  body: account.pick({ username: true, password: true }),
})
export type LoginRequest = Request<
  unknown,
  unknown,
  z.infer<typeof login>['body']
>
export type LoginReturn = Account & { access_token: string; sessionId: number }
export type LoginResponse = Response<LoginReturn>
