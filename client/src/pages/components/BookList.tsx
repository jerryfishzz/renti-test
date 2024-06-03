import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import BookCard from './BookCard'
import {
  Book,
  Status,
  getBooksResponse,
  getMyBooksResponse,
} from 'schemas/book.schema'
import { useValidation } from 'hooks/useValidation'
import { get, doQuery } from 'lib/query'
import { useAuth } from 'contexts/auth'

export type BookState = Book & { status?: Status }
type BookListProps = {
  type?: 'library' | 'my-list'
}
export default function BookList({ type = 'library' }: BookListProps) {
  const [books, setBooks] = useState<BookState[]>([])
  const fullProcessQuery = useValidation(get)
  const { user } = useAuth()

  useEffect(() => {
    let isMounted = true
    async function getList() {
      try {
        if (user?.id) {
          const books =
            type === 'library'
              ? await doQuery(fullProcessQuery, {
                  url: `/books/account/${user.id}`,
                  resSchema: getBooksResponse,
                })
              : await doQuery(fullProcessQuery, {
                  url: `/lists/account/${user.id}`,
                  resSchema: getMyBooksResponse,
                })
          isMounted && setBooks(books)
        }
      } catch (err) {
        toast.error((err as Error).message)
      }
    }

    getList()

    return () => {
      isMounted = false
    }
  }, [fullProcessQuery, type, user?.id])

  if (books.length === 0) return null

  return (
    <Grid container spacing={2}>
      {books.map(book => (
        <BookCard book={book} key={book.id} />
      ))}
    </Grid>
  )
}
