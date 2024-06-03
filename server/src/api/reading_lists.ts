import { db } from 'lib/db'
import { guard, router } from './utils'
import { auth } from 'lib/jwt'
import {
  GetByIdResponse,
  GetByUserIdRequest,
} from 'schemas/reading_list.schema'

router.get(
  '/lists/account/:id',
  auth(),
  guard(async (req: GetByUserIdRequest, res: GetByIdResponse) => {
    const lists = await db('reading_lists').where('account_id', req.params.id)
    if (!lists) return res.sendStatus(404)

    return res.send(lists)
  })
)

export { router as reading_lists }
