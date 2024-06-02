import Box from '@mui/material/Box'
import { ReactNode } from 'react'

import AppAppBar from './AppAppBar'

type LayoutProps = {
  children: ReactNode
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <AppAppBar />
      <Box sx={{ bgcolor: 'background.default' }}>{children}</Box>
    </>
  )
}
