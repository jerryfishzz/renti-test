import { z } from 'zod'
import type { Request, Response } from 'express'

import { Account, account } from 'types/db'

// const queryParams = z.object({
//   id: z.number().optional(),
//   username: z.string().optional(),
// })

// export const search = z.object({ params: queryParams })
// export type SearchRequest = Request<
//   z.infer<typeof search>['params'],
//   unknown,
//   unknown,
//   Pagination
// >
// export type SearchResponse = Response<PaginationResult<Account>>

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

export const createAccount = z.object({
  body: account.omit({ id: true, created_at: true, updated_at: true }),
})
export type CreateAccountRequest = Request<
  unknown,
  unknown,
  z.infer<typeof createAccount>['body']
>
export type CreateAccountResponse = Response<Account>

// export const Patch = Get.merge(z.object({ body: Account.partial() }))
// export type PatchRequest = Request<
//   z.infer<typeof Patch>['params'],
//   z.infer<typeof Patch>['body']
// >
// export type PatchResponse = Response

// export const Delete = Get
// export type DeleteRequest = Request<z.infer<typeof Delete>['params']>
// export type DeleteResponse = Response

export const login = z.object({
  body: account.pick({ username: true, password: true }),
})
export type LoginRequest = Request<
  unknown,
  unknown,
  z.infer<typeof login>['body']
>
export type LoginResponse = Response
