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
import { Chip, useTheme } from '@mui/material'

import StatusMenu from './StatusMenu'
import { BookState } from './BookList'

type StatusValue = {
  text: string
  color: 'success' | 'error' | 'warning'
}
export const readingStatus: Record<StatusState, StatusValue> = {
  completed: { text: 'Read', color: 'success' },
  reading: { text: 'Currently reading', color: 'warning' },
  wishlist: { text: 'Want to read', color: 'error' },
}

type BookCardProps = {
  book: BookState
}
export type StatusState = 'reading' | 'completed' | 'wishlist'

export default function BookCard({
  book: { id, author, title, cover_image, status: dbStatus, genre },
}: BookCardProps) {
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null!)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [status, setStatus] = useState<StatusState>('wishlist')
  const [isAdded, setIsAdded] = useState(false)

  const handleClick = () => {
    setIsAdded(cur => !cur)
    isAdded && setStatus('wishlist')
  }

  useEffect(() => {
    const { width, height } = containerRef.current.getBoundingClientRect()
    setContainerSize({ width, height })
  }, [])

  return (
    <Grid item xs={12} sm={6} md={3} key={id} sx={{ display: 'flex' }}>
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
          image={cover_image}
          title="green iguana"
        />
        {isAdded && <StatusMenu status={status} setStatus={setStatus} />}
        <CardContent>
          <Typography component="h2" variant="h4" color="text.primary">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {author}
          </Typography>
          <Chip
            sx={{ mt: 1 }}
            label={genre}
            variant="outlined"
            size="small"
            color="info"
          />
          {isAdded && (
            <Typography
              sx={{ mt: 1 }}
              variant="overline"
              color={theme.palette[readingStatus[status].color].main}
              display="block"
            >
              {readingStatus[status].text}
            </Typography>
          )}
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
