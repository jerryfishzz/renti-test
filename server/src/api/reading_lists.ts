import { db } from 'lib/db'
import { guard, router } from './utils'
import { auth } from 'lib/jwt'
import {
  GetByUserIdResponse,
  GetByUserIdRequest,
  GetByUserIdReturn,
  getByUserId,
} from 'schemas/reading_list.schema'
import validate from 'lib/validate'

router.get(
  '/lists/account/:id',
  auth(),
  validate(getByUserId),
  guard(async (req: GetByUserIdRequest, res: GetByUserIdResponse) => {
    const lists = await db('reading_lists').where('account_id', req.params.id)
    if (!lists) return res.sendStatus(404)

    const listedBooks: GetByUserIdReturn[] = []
    for (const list of lists) {
      const book = await db('books').where('id', list.book_id).first()
      if (!book) return res.sendStatus(500)

      const genre = await db('genres').where('id', book.genre_id).first()
      if (!genre) return res.sendStatus(500)

      listedBooks.push({ ...book, status: list.status, genre: genre.name })
    }

    return res.send(listedBooks)
  })
)

export { router as reading_lists }
