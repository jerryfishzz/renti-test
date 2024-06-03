import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import BookCard from './BookCard'
import { Book, getBooksResponse } from 'schemas/book.schema'
import { useValidation } from 'hooks/useValidation'
import query from 'lib/query'
import { getBooks } from 'actions/book.action'

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const fullProcessQuery = useValidation(query.get)

  useEffect(() => {
    getBooks(fullProcessQuery, {
      url: '/books',
      resSchema: getBooksResponse,
    })
      .then(books => {
        setBooks(books)
      })
      .catch(err => {
        toast.error(err.message)
      })
  }, [fullProcessQuery])

  if (books.length === 0) return null

  return (
    <Grid container spacing={2}>
      {books.map(book => (
        <BookCard book={book} key={book.id} />
      ))}
    </Grid>
  )
}
