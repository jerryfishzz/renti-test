import { useMemo } from 'react'
import { z } from 'zod'

import { useAuth } from 'contexts/auth'

type Query = (logout: () => void, location: Location) => ValidatedQuery
export type ValidatedQuery = <
  TRequest extends Record<string, unknown>,
  TResponse,
>(
  url: string,
  schema: z.Schema<TRequest> | undefined,
  data: unknown,
  resSchema: z.Schema<TResponse>,
) => Promise<TResponse>

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
