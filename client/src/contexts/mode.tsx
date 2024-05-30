import { PaletteMode } from '@mui/material'
import { Dispatch, SetStateAction, ReactNode } from 'react'

import { createContext } from 'lib/context'

type ModeContext = {
  mode: PaletteMode
  setMode: Dispatch<SetStateAction<PaletteMode>>
  toggleColorMode: () => void
}
const [useMode, modeContext] = createContext<ModeContext>()

type ModeProviderProps = {
  value: Omit<ModeContext, 'toggleColorMode'>
  children: ReactNode
}
function ModeProvider({ value, children }: ModeProviderProps) {
  const toggleColorMode = () => {
    value.setMode(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <modeContext.Provider value={{ ...value, toggleColorMode }}>
      {children}
    </modeContext.Provider>
  )
}

export { useMode, ModeProvider }
