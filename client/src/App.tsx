import { useState } from 'react'
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
