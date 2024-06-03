import Box from '@mui/material/Box'
import { ReactNode } from 'react'

import AppAppBar from './AppAppBar'
import Container from '@mui/material/Container'

type LayoutProps = {
  children: ReactNode
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <AppAppBar />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container
          sx={{
            pt: { xs: 4, sm: 12 },
            pb: { xs: 8, sm: 16 },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 3, sm: 6 },
          }}
        >
          {children}
        </Container>
      </Box>
    </>
  )
}
