import { useMemo } from 'react'

import { useAuth } from 'contexts/auth'
import { get, post } from 'lib/query'

type Type = 'get' | 'post'

// Use on AuthProvider
export function useAuthQuery(type: Type, logout: () => void) {
  const location = window.location
  const query = type === 'get' ? get : post

  return useMemo(() => query(logout, location), [location, logout, query])
}

// Use inside AuthProvider
export function useQuery(type: Type = 'get') {
  const location = window.location
  const { logout } = useAuth()
  const query = type === 'get' ? get : post

  return useMemo(() => query(logout, location), [location, logout, query])
}
