import { db } from 'lib/db'
import { guard, router } from './utils'
import validate from 'lib/validate'
import { ResponseGenre } from 'schemas/genre.schema'
import { GetParamsIdRequest, getParamsId } from 'schemas/shared.schema'

router.get(
  '/genres/:id',
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: ResponseGenre) => {
    const genre = await db('genres').where('id', req.params.id).first()
    if (!genre) return res.sendStatus(404)

    return res.send(genre)
  })
)

export { router as genres }
