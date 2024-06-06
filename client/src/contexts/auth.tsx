import { useState, useCallback, ReactNode } from 'react'
import toast from 'react-hot-toast'

import { createContext } from 'lib/context'
import { LoginResponse, loginRequest, loginResponse } from 'schemas/auth.schema'
import { useAuthQuery } from 'hooks/useSuperQuery'

const TIME_OUT = 10 * 60 * 1000 // 10 minutes
const USER_LOGIN = 'USER_LOGIN'

type AuthContext = {
  user: UserState
  login: (email: string, password: string, from: string) => void
  logout: () => void
}
const [useAuth, authContext] = createContext<AuthContext>()

type UserState = (LoginResponse & { from: string }) | undefined
type TimeoutIdState = NodeJS.Timeout | null
type AuthProviderProps = {
  children: ReactNode
}
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserState>(() => getUserFromLocalStorage())
  const [timeoutId, setTimeoutId] = useState<TimeoutIdState>(null)

  const logout = useCallback(() => {
    setUser(undefined)
    localStorage.removeItem(USER_LOGIN)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }, [timeoutId])

  const post = useAuthQuery('post', logout)

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
    async (username: string, password: string, from: string) => {
      try {
        const user = await post('/login', {
          reqSchema: loginRequest,
          data: { username, password },
          resSchema: loginResponse,
        })

        setUser({ ...user, from })
        localStorage.setItem(USER_LOGIN, JSON.stringify(user))
        startAutoLogoutTimer()
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    [post, startAutoLogoutTimer],
  )

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
