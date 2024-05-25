import { Router } from 'express'

import { db } from '../db'

const router = Router({ mergeParams: true })

router.get('/accounts/:id', async (req, res) => {
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
