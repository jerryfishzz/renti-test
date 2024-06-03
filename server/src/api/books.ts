import type { Request } from 'express'

import { db } from 'lib/db'
import { guard, router } from './utils'
import { GetBooksResponse, GetBooksReturn } from 'schemas/book.schema'
import { auth } from 'lib/jwt'
import { Book, Genre } from 'types/db'

router.get(
  '/books/account/:id',
  auth(),
  guard(async (req: Request, res: GetBooksResponse) => {
    const books = (await db('books')
      .select('books.*', 'genres.name as genre')
      .join('genres', 'books.genre_id', 'genres.id')) as Awaited<
      (Book & { genre: Genre['name'] })[]
    >
    if (!books) return res.sendStatus(404)

    const lists = await db('reading_lists').where('account_id', req.params.id)
    if (!lists) return res.sendStatus(404)

    const myBooks: GetBooksReturn[] = []
    for (const list of lists) {
      const book = await db('books').where('id', list.book_id).first()
      if (!book) return res.sendStatus(500)

      const genre = await db('genres').where('id', book.genre_id).first()
      if (!genre) return res.sendStatus(500)

      myBooks.push({ ...book, status: list.status, genre: genre.name })
    }

    const bookIdSet = new Set<number>()
    const wantedBooks: GetBooksReturn[] = []
    const allBooks = [...myBooks, ...books]
    for (const book of allBooks) {
      if (bookIdSet.has(book.id)) continue
      bookIdSet.add(book.id)
      wantedBooks.push(book)
    }

    return res.send(wantedBooks)
  })
)

export { router as books }
