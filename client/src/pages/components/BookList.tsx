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
import { useQuery } from 'hooks/useQuery'
import { useAuth } from 'contexts/auth'

export type BookState = Book & { status?: Status }
type BookListProps = {
  type?: 'library' | 'my-list'
}
export default function BookList({ type = 'library' }: BookListProps) {
  const [books, setBooks] = useState<BookState[]>([])
  const get = useQuery()
  const { user } = useAuth()

  useEffect(() => {
    let isMounted = true
    async function getList() {
      try {
        if (user?.id) {
          const books =
            type === 'library'
              ? await get(`/books/account/${user.id}`, {
                  resSchema: getBooksResponse,
                })
              : await get(`/lists/account/${user.id}`, {
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
  }, [get, type, user?.id])

  if (books.length === 0) return null

  return (
    <Grid container spacing={2}>
      {books.map(book => (
        <BookCard book={book} key={book.id} />
      ))}
    </Grid>
  )
}
