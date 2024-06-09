import type { Response } from 'express'

import { db } from 'lib/db'
import { guard, router } from './utils'
import {
  CreateBookRequest,
  CreateBooksRequest,
  GetBooksByAccountIdResponse,
  GetBooksByAccountIdReturn,
  ResponseBook,
  createBook,
  createBooks,
} from 'schemas/book.schema'
import { auth } from 'lib/jwt'
import { Book, Genre } from 'types/db'
import validate from 'lib/validate'
import { GetParamsIdRequest, getParamsId } from 'schemas/shared.schema'

router.get(
  '/books/account/:id',
  auth(),
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: GetBooksByAccountIdResponse) => {
    const books = (await db('books')
      .select('books.*', 'genres.name as genre')
      .join('genres', 'books.genre_id', 'genres.id')) as Awaited<
      (Book & { genre: Genre['name'] })[]
    >
    if (!books) return res.sendStatus(404)

    const lists = await db('reading_lists').where('account_id', req.params.id)
    if (!lists) return res.sendStatus(404)

    const myBooks: GetBooksByAccountIdReturn[] = []
    for (const list of lists) {
      const book = await db('books').where('id', list.book_id).first()
      if (!book) return res.sendStatus(500)

      const genre = await db('genres').where('id', book.genre_id).first()
      if (!genre) return res.sendStatus(500)

      myBooks.push({ ...book, status: list.status, genre: genre.name })
    }

    const bookIdSet = new Set<number>()
    const wantedBooks: GetBooksByAccountIdReturn[] = []
    const allBooks = [...myBooks, ...books]
    for (const book of allBooks) {
      if (bookIdSet.has(book.id)) continue
      bookIdSet.add(book.id)
      wantedBooks.push(book)
    }

    return res.send(wantedBooks)
  })
)

router.post(
  '/books',
  auth(),
  validate(createBook),
  guard(async (req: CreateBookRequest, res: ResponseBook) => {
    const [book] = await db('books').insert(req.body).returning('*')
    return res.send(book)
  })
)

router.post(
  '/books/bulk',
  auth(),
  validate(createBooks),
  guard(async (req: CreateBooksRequest, res: Response) => {
    await db('books').insert(req.body)
    return res.sendStatus(200)
  })
)

router.delete(
  '/books/:id',
  auth(),
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: ResponseBook) => {
    const [deleted] = await db('books')
      .where('id', req.params.id)
      .delete()
      .returning('*') // Retune the deleted record
    return res.send(deleted)
  })
)

// For POC test only
router.get(
  '/books/get-all',
  auth(),
  guard(async (req, res) => {
    const books = await db('books').select('*')
    const genres = await db('genres').select('*')
    const genreMap = new Map(genres.map(genre => [genre.id, genre.name]))
    const booksWithGenres = books.map(book => ({
      ...book,
      genre: genreMap.get(book.genre_id),
    }))
    return res.send(booksWithGenres)
  })
)

// For POC test only
router.get(
  '/books/get-all-join',
  auth(),
  guard(async (req, res) => {
    const books = (await db('books')
      .select('books.*', 'genres.name as genre')
      .join('genres', 'books.genre_id', 'genres.id')) as Awaited<
      (Book & { genre: Genre['name'] })[]
    >
    return res.send(books)
  })
)

export { router as books }
