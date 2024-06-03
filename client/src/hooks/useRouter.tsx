import {
  LoaderFunctionArgs,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom'
import { useCallback, useMemo } from 'react'

import SignIn from '../pages/SignIn'
import Library from '../pages/Library'
import Clubs from '../pages/Clubs'
import User from '../pages/User'
import { useAuth } from 'contexts/auth'
import Layout from 'pages/components/Layout'
import MyList from 'pages/MyList'

export function useRouter() {
  const { user } = useAuth()

  const loginLoader = useCallback(() => {
    if (!user) return null
    return redirect(user.from || '/')
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

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route path="/">
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route index element={<Library />} loader={protectedLoader} />
              <Route
                path="my-list"
                element={<MyList />}
                loader={protectedLoader}
              />
              <Route
                path="clubs"
                element={<Clubs />}
                loader={protectedLoader}
              />
              <Route
                path="user/:id"
                element={<User />}
                loader={protectedLoader}
              />
            </Route>

            <Route path="sign-in" element={<SignIn />} loader={loginLoader} />
          </Route>,
        ),
      ),
    [loginLoader, protectedLoader],
  )

  return router
}
