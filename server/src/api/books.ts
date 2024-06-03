import type { Request } from 'express'

import { db } from 'lib/db'
import { guard, router } from './utils'
import { GetBooksResponse } from 'schemas/book.schema'
import { auth } from 'lib/jwt'

router.get(
  '/books',
  auth(),
  guard(async (req: Request, res: GetBooksResponse) => {
    const books = await db('books')
      .select('books.*', 'genres.name as genre')
      .join('genres', 'books.genre_id', 'genres.id')

    if (!books) return res.sendStatus(404)

    return res.send(books)
  })
)

export { router as books }
