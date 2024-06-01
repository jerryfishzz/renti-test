import {
  LoaderFunctionArgs,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom'

import SignIn from './pages/SignIn'
import Library from './pages/Library'
import Clubs from './pages/Clubs'
import User from './pages/User'
import { useAuth } from 'contexts/auth'
import { useCallback } from 'react'

export function useRouter() {
  const { user } = useAuth()

  const loginLoader = useCallback(() => {
    if (!user) return null
    return redirect('/')
  }, [user])

  const protectedLoader = useCallback(
    ({ request }: LoaderFunctionArgs) => {
      if (!user) {
        const params = new URLSearchParams()
        params.set('from', new URL(request.url).pathname)
        return redirect('/sign-in?' + params.toString())
      }
      return null
    },
    [user],
  )

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Library />} loader={protectedLoader} />
        <Route path="clubs" element={<Clubs />} loader={protectedLoader} />
        <Route path="user" element={<User />} loader={protectedLoader} />
        <Route path="sign-in" element={<SignIn />} loader={loginLoader} />
      </Route>,
    ),
  )

  return router
}
