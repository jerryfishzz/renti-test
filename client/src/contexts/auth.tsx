import { useState, useEffect, useCallback, ReactNode } from 'react'

import { createContext } from 'lib/context'

const TIME_OUT = 10 * 60 * 1000 // 10 minutes
const USER_LOGIN = 'USER_LOGIN'

type AuthContext = {
  user: string
  login: (email: string, password: string) => void
  logout: () => void
}
const [useAuth, authContext] = createContext<AuthContext>()

type TimeoutIdState = NodeJS.Timeout | null
type AuthProviderProps = {
  children: ReactNode
}
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<string>('')
  const [timeoutId, setTimeoutId] = useState<TimeoutIdState>(null)

  const logout = useCallback(() => {
    setUser('')
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
    (email: string, password: string) => {
      if (email === 'user@example.com' && password === 'password') {
        const user = { email }
        setUser(JSON.stringify(user))
        localStorage.setItem(USER_LOGIN, JSON.stringify(user))
        startAutoLogoutTimer()
      } else {
        throw new Error('Invalid email or password')
      }
    },
    [startAutoLogoutTimer],
  )

  // Use local storage if there is a user stored
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_LOGIN)
    if (storedUser !== null && storedUser !== user) {
      setUser(storedUser)
      startAutoLogoutTimer()
    }
  }, [startAutoLogoutTimer, user])

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  )
}

export { useAuth, AuthProvider }
