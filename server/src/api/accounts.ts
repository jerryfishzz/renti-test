import bcrypt from 'bcrypt'

import { db } from 'lib/db'
import { guard, router } from './utils'
import validate from 'lib/validate'
import {
  CreateAccountRequest,
  CreateAccountResponse,
  GetByIdRequest,
  GetByIdResponse,
  GetByUsernameRequest,
  GetByUsernameResponse,
  createAccount,
  getById,
  getByUsername,
} from 'schemas/account.schema'

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

router.get(
  '/accounts/username/:username',
  validate(getByUsername),
  guard(async (req: GetByUsernameRequest, res: GetByUsernameResponse) => {
    try {
      const account = await db('accounts')
        .where('username', req.params.username)
        .first()
      if (!account) return res.sendStatus(404)

      return res.send(account)
    } catch (error) {
      console.error(error)
      throw error
    }
  })
)

router.post(
  '/accounts',
  validate(createAccount),
  guard(async (req: CreateAccountRequest, res: CreateAccountResponse) => {
    const hashed = await bcrypt.hash(
      req.body.password,
      Number(process.env.SALT_ROUNDS)
    )
    const [account] = await db('accounts')
      .insert({ ...req.body, password: hashed })
      .returning('*')
    return res.send(account)
  })
)

export { router as accounts }
