import { Router } from 'express'

import { db } from 'lib/db'
import { guard } from 'lib/guard'
import validate from 'lib/validate'
import {
  GetByIdRequest,
  GetByIdResponse,
  getById,
} from 'schemas/account.schema'

export const router = Router({ mergeParams: true })

router.get(
  '/accounts/:id',
  validate(getById),
  guard(async (req: GetByIdRequest, res: GetByIdResponse) => {
    try {
      const account = await db('accounts').where('id', req.params.id).first()
      if (!account) return res.sendStatus(404)

      return res.send(account)
    } catch (error) {
      console.error(error)
      throw error
    }
  })
)

export { router as accounts }
