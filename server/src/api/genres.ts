import { db } from 'lib/db'
import { guard, router } from './utils'
import validate from 'lib/validate'
import { GetByIdRequest, GetByIdResponse, getById } from 'schemas/genre.schema'

router.get(
  '/genres/:id',
  validate(getById),
  guard(async (req: GetByIdRequest, res: GetByIdResponse) => {
    const genre = await db('genres').where('id', req.params.id).first()
    if (!genre) return res.sendStatus(404)

    return res.send(genre)
  })
)

export { router as genres }
