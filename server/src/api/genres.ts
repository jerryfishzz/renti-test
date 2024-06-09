import { db } from 'lib/db'
import { guard, router } from './utils'
import validate from 'lib/validate'
import { GetGenresResponse, ResponseGenre } from 'schemas/genre.schema'
import { GetParamsIdRequest, getParamsId } from 'schemas/shared.schema'
import { auth } from 'lib/jwt'

router.get(
  '/genres/:id',
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: ResponseGenre) => {
    const genre = await db('genres').where('id', req.params.id).first()
    if (!genre) return res.sendStatus(404)

    return res.send(genre)
  })
)

router.get(
  '/genres',
  auth(),
  guard(async (req, res: GetGenresResponse) => {
    const genres = await db('genres').select('*')
    if (!genres.length) return res.sendStatus(404)

    return res.send(genres)
  })
)

export { router as genres }
