import { z } from 'zod'

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

  // TODO: Add error handling for no user info
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${user ? user.access_token : ''}`,
      ...options.headers,
    },
  })
}

async function post<T extends Record<string, unknown>>(
  url: string,
  schema: z.Schema<T> | null,
  body: T,
) {
  try {
    const validatedResult = schema ? validate(schema, body) : body

    const response = await baseQuery(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedResult),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

const query = { post }

export default query
