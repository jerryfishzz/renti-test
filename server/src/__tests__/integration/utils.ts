import TestAgent from 'supertest/lib/agent'
import request, { Response, Test } from 'supertest'

import { LoginReturn } from 'schemas/account.schema'
import app from 'lib/express'
import { accounts } from 'api/accounts'
import { books } from 'api/books'
import { genres } from 'api/genres'

let access_token: string
let sessionId: number
const { API_USER, API_PASS } = process.env

app.use(accounts)
app.use(books)
app.use(genres)
const agent = request(app)

// Customize the response type from supertest
// to make it generic.
export type CustomResponse<T = any> = Omit<Response, 'body'> & { body: T }

export async function logIn(agent: TestAgent) {
  const response = (await agent
    .post('/login')
    .send({ username: API_USER, password: API_PASS })) as Awaited<
    CustomResponse<LoginReturn>
  >

  if (response.status === 403) {
    console.error(response.text)
    throw Error('Failed to login')
  }

  access_token = response.body.access_token

  return response.body.sessionId
}

// To be deleted
export function createDoAuth(login: CustomResponse<LoginReturn>) {
  return (test: Test): Promise<CustomResponse> => {
    return test
      .set('Authorization', `Bearer ${login.body.access_token}`)
      .set('Accept', 'application/json')
  }
}

type Method = 'get' | 'post' | 'patch' | 'delete'
type BaseOptions<T extends Method> = {
  method: T
}
type GetOptions<T extends Method> = T extends 'get'
  ? BaseOptions<T> | undefined
  : BaseOptions<T> & { body: Record<string, any> }

function doAgentQuery<T extends Method>(path: string, options?: GetOptions<T>) {
  const test =
    !options || options.method === 'get'
      ? agent.get(path)
      : options.method === 'post'
      ? agent.post(path).send(options.body)
      : options.method === 'patch'
      ? agent.patch(path).send(options.body)
      : agent.delete(path)
  return test
    .set('Authorization', `Bearer ${access_token}`)
    .set('Accept', 'application/json')
}

type QueryProps = {
  path: string
  options?: GetOptions<Method>
  failed?: boolean
}
async function query({ path, options, failed = false }: QueryProps) {
  // This can occur errors.
  // Use status and others to check errors.

  const response = await doAgentQuery(path, options)

  if (response.status === 403 && !failed) {
    await logIn(agent)
    return query({ path, options, failed: true })
  }

  return response
}

export async function jsonQuery({ path, options, failed = false }: QueryProps) {
  const response = await query({ path, options, failed })

  return response.body
}

async function textQuery({ path, options, failed = false }: QueryProps) {
  const response = await query({ path, options, failed })

  return response.text
}
