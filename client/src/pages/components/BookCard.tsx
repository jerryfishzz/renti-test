import { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove'
import { Book } from 'pages/types'
import { Chip } from '@mui/material'

import StatusMenu from './StatusMenu'

type BookCardProps = {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const [isAdded, setIsAdded] = useState(false)

  const handleClick = () => {
    setIsAdded(cur => !cur)
  }

  useEffect(() => {
    const { width, height } = containerRef.current.getBoundingClientRect()
    setContainerSize({ width, height })
  }, [])

  return (
    <Grid item xs={12} sm={6} md={3} key={book.id} sx={{ display: 'flex' }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          p: 1,
          position: 'relative',
        }}
      >
        <CardMedia
          ref={containerRef}
          sx={{ height: containerSize.width * 1.6 }}
          image={book.cover_image}
          title="green iguana"
        />
        <StatusMenu />
        <CardContent>
          <Typography component="h2" variant="h4" color="text.primary">
            {book.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {book.author}
          </Typography>
          <Chip
            sx={{ mt: 1 }}
            label={book.genre}
            variant="outlined"
            size="small"
            color="info"
          />
        </CardContent>
        <CardActions>
          {!isAdded ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<BookmarkAddIcon />}
              onClick={handleClick}
            >
              Add to List
            </Button>
          ) : (
            <Button
              fullWidth
              color="secondary"
              onClick={handleClick}
              startIcon={<BookmarkRemoveIcon />}
            >
              Remove from List
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  )
}
