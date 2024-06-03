import { Box, Typography } from '@mui/material'

import BookList from './components/BookList'

export default function Library() {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography variant="h2" component="h1">
          Library
        </Typography>
      </Box>
      <BookList />
    </>
  )
}
