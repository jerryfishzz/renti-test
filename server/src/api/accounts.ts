import { Router } from 'express'

import { db } from 'lib/db'
import validate from 'lib/validate'
import { getById } from 'schemas/account.schema'

const router = Router({ mergeParams: true })

router.get('/accounts/:id', validate(getById), async (req, res) => {
  try {
    const account = await db('accounts').where('id', req.params.id).first()
    console.log('account')
    console.log(account)
    return res.sendStatus(200)
  } catch (error) {
    console.error(error)
    throw error
  }
})

export { router }
