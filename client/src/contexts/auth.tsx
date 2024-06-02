import { useState, useEffect, useCallback, ReactNode } from 'react'
import toast from 'react-hot-toast'

import { createContext } from 'lib/context'
import { LoginResponse, loginRequest, loginResponse } from 'schemas/auth.schema'
import { useAuthValidation } from 'hooks/useValidation'
import query from 'lib/query'

const TIME_OUT = 10 * 60 * 1000 // 10 minutes
const USER_LOGIN = 'USER_LOGIN'

type AuthContext = {
  user: UserState
  login: (email: string, password: string) => void
  logout: () => void
}
const [useAuth, authContext] = createContext<AuthContext>()

type UserState = LoginResponse | undefined
type TimeoutIdState = NodeJS.Timeout | null
type AuthProviderProps = {
  children: ReactNode
}
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserState>()
  const [timeoutId, setTimeoutId] = useState<TimeoutIdState>(null)

  const logout = useCallback(() => {
    setUser(undefined)
    localStorage.removeItem(USER_LOGIN)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }, [timeoutId])

  const validatedQuery = useAuthValidation(query.post, logout)

  const startAutoLogoutTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const id = setTimeout(() => {
      logout()
      alert('You have been logged out due to inactivity.')
    }, TIME_OUT)
    setTimeoutId(id)
  }, [logout, timeoutId])

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const user = await validatedQuery(
          '/login',
          loginRequest,
          { username, password },
          loginResponse,
        )
        console.log(user)
        setUser(user)
        localStorage.setItem(USER_LOGIN, JSON.stringify(user))
        startAutoLogoutTimer()
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    [startAutoLogoutTimer, validatedQuery],
  )

  // Use local storage if there is a user stored
  useEffect(() => {
    const storedUser = getUserFromLocalStorage()
    if (storedUser) {
      if ((user && storedUser.id !== user.id) || !user) {
        setUser(storedUser)
        startAutoLogoutTimer()
      }
    }
  }, [startAutoLogoutTimer, user])

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  )
}

function getUserFromLocalStorage(): UserState {
  const user = localStorage.getItem(USER_LOGIN)
  return user ? JSON.parse(user) : undefined
}

export { useAuth, AuthProvider, getUserFromLocalStorage }
