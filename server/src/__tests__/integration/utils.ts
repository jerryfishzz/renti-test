import TestAgent from 'supertest/lib/agent'
import request, { Response as STResponse, Test } from 'supertest'

import { LoginReturn } from 'schemas/account.schema'
import app from 'lib/express'
import routes from 'routes'

let access_token: string
let sessionId: number
const { API_USER, API_PASS } = process.env

routes(app)
const agent = request(app)

// Customize the response type from supertest
// to make it generic.
export type Response<T = any> = Omit<STResponse, 'body'> & { body: T }
type LogInProps = { username?: string; password?: string }

function createLogIn(agent: TestAgent) {
  return async ({ username, password }: LogInProps = {}) => {
    const response = (await agent.post('/login').send({
      username: username ?? API_USER,
      password: password ?? API_PASS,
    })) as Awaited<Response<LoginReturn>>

    if (response.status === 403) {
      console.error(response.text)
      throw Error('Failed to login')
    }

    access_token = response.body.access_token

    return response.body.sessionId
  }
}
export const logIn = createLogIn(agent)

// To be deleted
export function createDoAuth(login: Response<LoginReturn>) {
  return (test: Test): Promise<Response> => {
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
  : T extends 'delete'
  ? BaseOptions<T>
  : BaseOptions<T> & { body: Record<string, any> }

type DoAgentQueryProps<T extends Method> = {
  path: string
  options?: GetOptions<T>
  cookie?: string[]
}
function doAgentQuery<T extends Method>({
  path,
  options,
  cookie,
}: DoAgentQueryProps<T>) {
  const test =
    !options || options.method === 'get'
      ? agent.get(path)
      : options.method === 'post'
      ? agent.post(path).send(options.body)
      : options.method === 'patch'
      ? agent.patch(path).send(options.body)
      : agent.delete(path)
  const response = test
    .set('Authorization', `Bearer ${access_token}`)
    .set('Accept', 'application/json')

  // Manually set session cookie on agent
  return cookie ? response.set('Cookie', [...cookie]) : response
}

type QueryProps = {
  path: string
  options?: GetOptions<Method>
  failed?: boolean
  cookie?: string[]
}
export async function query({
  path,
  options,
  failed = false,
  cookie,
}: QueryProps) {
  // This function can occur to async errors.
  // But it is not what api tests are concerned for.
  // So won't set try catch to handle it.

  const response = await doAgentQuery({ path, options, cookie })

  if (response.status === 403 && !failed && path !== '/login') {
    await logIn()
    return query({ path, options, failed: true })
  }

  return response
}
