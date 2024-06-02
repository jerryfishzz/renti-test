import { getUserFromLocalStorage } from 'contexts/auth'

const { REACT_APP_API_SCHEME, REACT_APP_API_DOMAIN, REACT_APP_API_PORT } =
  process.env
const API_BASE_URL =
  REACT_APP_API_SCHEME && REACT_APP_API_DOMAIN && REACT_APP_API_PORT
    ? `${REACT_APP_API_SCHEME}://${REACT_APP_API_DOMAIN}:${REACT_APP_API_PORT}`
    : 'http://localhost:3001'

const query = (url: string, options: RequestInit = {}) => {
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

export { query }
