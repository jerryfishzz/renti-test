import { useEffect, useState } from 'react'
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from '@mui/material'

import { ModeProvider } from 'contexts/mode'
import RouterWrapper from 'pages/components/RouterWrapper'
import { AuthProvider } from 'contexts/auth'
import { Toaster } from 'react-hot-toast'

function App() {
  const [mode, setMode] = useState<PaletteMode>('light')
  const theme = createTheme({ palette: { mode } })

  console.log(process.env.NODE_ENV)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await query('/accounts/1')
  //     console.log(response)
  //     const data = await response.json()
  //     console.log(data)
  //   }
  //   fetchData()
  // }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModeProvider value={{ mode, setMode }}>
        <AuthProvider>
          <RouterWrapper />
        </AuthProvider>
        <Toaster />
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App
