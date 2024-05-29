import { RouterProvider } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from '@mui/material'

import router from './router'
import { ModeProvider } from 'contexts/mode'
import AppAppBar from 'pages/components/AppAppBar'

function App() {
  const [mode, setMode] = useState<PaletteMode>('light')
  const theme = createTheme({ palette: { mode } })

  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'))
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/accounts/1')
      console.log(response)
      const data = await response.json()
      console.log(data)
    }
    fetchData()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModeProvider value={[mode, setMode]}>
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <RouterProvider router={router} />
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App
