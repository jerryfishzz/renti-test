import { useMemo } from 'react'

import { useAuth } from 'contexts/auth'
import { ValidatedQuery } from 'lib/query'

type Query = (logout: () => void, location: Location) => ValidatedQuery

// Use on AuthProvider
export function useAuthSuperQuery(query: Query, logout: () => void) {
  const location = window.location

  const superQuery = useMemo(
    () => query(logout, location),
    [location, logout, query],
  )

  return superQuery
}

// Use inside AuthProvider
export function useSuperQuery(query: Query) {
  const location = window.location
  const { logout } = useAuth()

  const superQuery = useMemo(
    () => query(logout, location),
    [location, logout, query],
  )

  return superQuery
}
