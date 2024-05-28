import { PaletteMode } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

import createContext from 'lib/context'

const [useMode, modeContext] =
  createContext<[PaletteMode, Dispatch<SetStateAction<PaletteMode>>]>()

const ModeProvider = modeContext.Provider

export { useMode, ModeProvider }
