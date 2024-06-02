import { useState, useEffect, useCallback, ReactNode } from 'react'

import { createContext } from 'lib/context'
import { doLogIn } from 'actions/auth.action'
import { LoginResponse } from 'schemas/auth.schema'

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
        const user = await doLogIn(username, password)
        console.log(user)
        setUser(user)
        localStorage.setItem(USER_LOGIN, JSON.stringify(user))
        startAutoLogoutTimer()
      } catch (error) {
        console.error(error)
        throw new Error('Invalid username or password')
      }
    },
    [startAutoLogoutTimer],
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
