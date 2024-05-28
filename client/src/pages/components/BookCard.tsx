import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardMedia'
import { useEffect, useRef, useState } from 'react'

export default function BookCard({ book }: any) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const { width, height } = containerRef.current.getBoundingClientRect()
    setContainerSize({ width, height })
  }, [])

  return (
    <Grid item xs={12} sm={6} md={4} key={book.id} sx={{ display: 'flex' }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          p: 1,
        }}
      >
        <CardMedia
          ref={containerRef}
          sx={{ height: containerSize.width * 1.6 }}
          image={book.cover_image}
          title="green iguana"
        />
        <CardContent>
          <Typography component="h2" variant="h4" color="text.primary">
            {book.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {book.author}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
