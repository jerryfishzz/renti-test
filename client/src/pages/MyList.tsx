import { Box, Typography } from '@mui/material'

import BookList from './components/BookList'

export default function MyList() {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography variant="h2" component="h1">
          My List
        </Typography>
      </Box>
      <BookList />
    </>
  )
}
