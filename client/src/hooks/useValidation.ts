import { useMemo } from 'react'

import { useAuth } from 'contexts/auth'
import { ValidatedQuery } from 'lib/query'

type Query = (logout: () => void, location: Location) => ValidatedQuery

// Use on AuthProvider
export function useAuthValidation(query: Query, logout: () => void) {
  const location = window.location

  const validatedQuery = useMemo(
    () => query(logout, location),
    [location, logout, query],
  )

  return validatedQuery
}

// Use inside AuthProvider
export function useValidation(query: Query) {
  const location = window.location
  const { logout } = useAuth()

  const validatedQuery = useMemo(
    () => query(logout, location),
    [location, logout, query],
  )

  return validatedQuery
}
