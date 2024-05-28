import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import SignIn from './pages/SignIn'
import Library from './pages/Library'
import Clubs from './pages/Clubs'
import User from './pages/User'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Library />} />
      <Route path="clubs" element={<Clubs />} />
      <Route path="user" element={<User />} />
      <Route path="sign-in" element={<SignIn />} />
    </Route>
  )
)

export default router
