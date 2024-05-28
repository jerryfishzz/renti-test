import { RouterProvider } from 'react-router-dom'

import router from './router'
import Library from './pages/Library'

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('/accounts/1')
  //     console.log(response)
  //     const data = await response.json()
  //     console.log(data)
  //   }
  //   fetchData()
  // }, [])

  return <RouterProvider router={router} />
}

export default App
