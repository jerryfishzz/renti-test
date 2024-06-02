import { RouterProvider } from 'react-router-dom'

import { useRouter } from 'hooks/useRouter'

export default function RouterWrapper() {
  const router = useRouter()
  return <RouterProvider router={router} />
}
