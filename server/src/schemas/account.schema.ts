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

// export const Post = z.object({
//   body: Account.omit({ id: true, created_at: true, updated_at: true }),
// })
// export type PostRequest = Request<
//   unknown,
//   unknown,
//   z.infer<typeof Post>['body']
// >
// export type PostResponse = Response<Partial<DBAccount>>

// export const Patch = Get.merge(z.object({ body: Account.partial() }))
// export type PatchRequest = Request<
//   z.infer<typeof Patch>['params'],
//   z.infer<typeof Patch>['body']
// >
// export type PatchResponse = Response

// export const Delete = Get
// export type DeleteRequest = Request<z.infer<typeof Delete>['params']>
// export type DeleteResponse = Response

// export const Login = z.object({
//   body: Account.pick({ username: true, password: true }),
// })
// export type LoginRequest = Request<
//   unknown,
//   unknown,
//   z.infer<typeof Login>['body']
// >
// export type LoginResponse = Response<{ access_token: string }>
