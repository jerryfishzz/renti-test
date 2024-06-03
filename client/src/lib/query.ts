import { z } from 'zod'
import { redirect } from 'react-router-dom'

import { getUserFromLocalStorage } from 'contexts/auth'
import { validate } from './validate'

const { REACT_APP_API_SCHEME, REACT_APP_API_DOMAIN, REACT_APP_API_PORT } =
  process.env
const API_BASE_URL =
  REACT_APP_API_SCHEME && REACT_APP_API_DOMAIN && REACT_APP_API_PORT
    ? `${REACT_APP_API_SCHEME}://${REACT_APP_API_DOMAIN}:${REACT_APP_API_PORT}`
    : 'http://localhost:3001'

const baseQuery = (url: string, options: RequestInit = {}) => {
  const user = getUserFromLocalStorage()

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${user ? user.access_token : ''}`,
      ...options.headers,
    },
  })
}

function getRequest(url: string) {
  return baseQuery(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
function postRequest(url: string, data: unknown) {
  return baseQuery(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

function createQuery(
  request: (url: string, data: unknown) => Promise<Response>,
) {
  return (logout: () => void, location: Location) => {
    return async <TRequest extends Record<string, unknown>, TResponse>(
      url: string,
      reqSchema: z.Schema<TRequest> | undefined,
      data: unknown,
      resSchema: z.Schema<TResponse>,
    ) => {
      try {
        const validatedRequest = reqSchema ? validate(reqSchema, data) : data
        const response = await request(url, validatedRequest)

        if (!response.ok) {
          if (response.status === 403) {
            logout()
            console.log(location.pathname)

            const errorMsg =
              location.pathname === '/sign-in'
                ? 'Invalid username or password'
                : 'Please sign in'

            const params = new URLSearchParams()
            params.set('from', location.pathname)
            redirect('/sign-in?' + params.toString())
            throw new Error(errorMsg)
          }

          throw new Error(response.statusText)
        }

        const result = await response.json()
        const validatedResult = validate(resSchema, result)
        return validatedResult
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}

const get = createQuery(getRequest)
const post = createQuery(postRequest)

type ValidatedQuery = <TRequest extends Record<string, unknown>, TResponse>(
  url: string,
  schema: z.Schema<TRequest> | undefined,
  data: unknown,
  resSchema: z.Schema<TResponse>,
) => Promise<TResponse>
type Options<TRequest extends Record<string, unknown>, TResponse> = {
  url: string
  schema?: z.Schema<TRequest>
  data?: unknown
  resSchema: z.Schema<TResponse>
}
function doQuery<TRequest extends Record<string, unknown>, TResponse>(
  query: ValidatedQuery,
  options: Options<TRequest, TResponse>,
) {
  const { url, schema, data, resSchema } = options
  return query(url, schema, data, resSchema)
}

export { get, post, doQuery }
export type { ValidatedQuery }
