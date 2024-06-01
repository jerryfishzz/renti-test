import { RouterProvider } from 'react-router-dom'

import { useRouter } from 'router'

export default function RouterWrapper() {
  const router = useRouter()

  return <RouterProvider router={router} />
}
