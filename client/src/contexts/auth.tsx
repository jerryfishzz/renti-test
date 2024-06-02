import { useState, useEffect, useCallback, ReactNode } from 'react'

import { createContext } from 'lib/context'
import { doLogIn } from 'actions/auth.action'

import { z } from 'zod'

export const user = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  reading_preferences: z.array(z.string()),
  access_token: z.string(),
})
export type User = z.infer<typeof user>

const TIME_OUT = 10 * 60 * 1000 // 10 minutes
const USER_LOGIN = 'USER_LOGIN'

type AuthContext = {
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
}
const [useAuth, authContext] = createContext<AuthContext>()

type TimeoutIdState = NodeJS.Timeout | null
type AuthProviderProps = {
  children: ReactNode
}
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [timeoutId, setTimeoutId] = useState<TimeoutIdState>(null)

  const logout = useCallback(() => {
    setUser(null)
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
        const user = (await doLogIn(username, password)) as Awaited<User>
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
    if (storedUser !== null) {
      const parsedUser = JSON.parse(storedUser) as User
      if ((user && parsedUser.id !== user.id) || !user) {
        setUser(parsedUser)
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

function getUserFromLocalStorage() {
  return localStorage.getItem(USER_LOGIN)
}

export { useAuth, AuthProvider, getUserFromLocalStorage }
