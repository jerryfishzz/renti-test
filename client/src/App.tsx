import { useEffect, useState } from 'react'
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from '@mui/material'

import { ModeProvider } from 'contexts/mode'
import AppAppBar from 'pages/components/AppAppBar'
// import { query } from 'lib/query'
import RouterWrapper from 'pages/components/RouterWrapper'
import { AuthProvider } from 'contexts/auth'

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
          <AppAppBar />
          <RouterWrapper />
        </AuthProvider>
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App
