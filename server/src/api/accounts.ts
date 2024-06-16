import { addDays, addHours } from 'date-fns'
import bcrypt from 'bcryptjs'
import { Response } from 'express'

import { db } from 'lib/db'
import { auth, sign } from 'lib/jwt'
import { guard, router } from './utils'
import validate from 'lib/validate'
import {
  CreateAccountRequest,
  CreateAccountResponse,
  DeleteByIdRequest,
  GetByIdRequest,
  GetByIdResponse,
  GetByUsernameRequest,
  GetByUsernameResponse,
  LoginRequest,
  LoginResponse,
  createAccount,
  deleteById,
  getById,
  getByUsername,
  login,
} from 'schemas/account.schema'
import { Session } from 'types/db'

const isProduction = process.env.NODE_ENV === 'production'

router.get(
  '/accounts/:id',
  auth(),
  validate(getById),
  guard(async (req: GetByIdRequest, res: GetByIdResponse) => {
    const account = await db('accounts').where('id', req.params.id).first()
    if (!account) return res.sendStatus(404)

    return res.send(account)
  })
)

router.get(
  '/accounts/username/:username',
  auth(),
  validate(getByUsername),
  guard(async (req: GetByUsernameRequest, res: GetByUsernameResponse) => {
    const account = await db('accounts')
      .where('username', req.params.username)
      .first()
    if (!account) return res.sendStatus(404)

    return res.send(account)
  })
)

router.post(
  '/accounts',
  auth(),
  validate(createAccount),
  guard(async (req: CreateAccountRequest, res: CreateAccountResponse) => {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))
    const hashed = bcrypt.hashSync(req.body.password, salt)

    const [account] = await db('accounts')
      .insert({ ...req.body, password: hashed })
      .returning('*')
    return res.send(account)
  })
)

router.post(
  '/login',
  validate(login),
  guard(async (req: LoginRequest, res: LoginResponse) => {
    const account = await db('accounts')
      .where({
        username: req.body.username,
      })
      .first()
    if (!account) return res.sendStatus(403)

    const checkPassword = await bcrypt.compare(
      req.body.password || '',
      account.password
    )
    if (!checkPassword) return res.sendStatus(403)

    console.log(req.cookies)
    console.log(req.cookies?.sessionId)

    // First time login or session expired
    if (!req.cookies?.sessionId) {
      const refresh_token = sign({
        id: account.id,
        isAuthenticated: true,
        iat: new Date().getTime() / 1000,
        exp: addDays(new Date(), 15).getTime() / 1000, // Expiring time = current time + 15 days
      })

      const [session] = await db('sessions')
        .insert({
          account_id: account.id,
          user_agent: req.headers['user-agent'],
          refresh_token,
        })
        .returning('*')
      const sessionId = (session as Session).id.toString()

      // Set the cookie with the session ID
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 * 15, // 15 days in milliseconds
      })
    }

    // TODO: create a new session if the current session from the cookie cannot be found in the database

    const access_token = sign({
      id: account.id,
      isAuthenticated: true,
      iat: new Date().getTime() / 1000, // Current time
      exp: addHours(new Date(), 1).getTime() / 1000, // Expiring time = current time + 1 hour
    })
    return res.send({
      ...account,
      access_token,
    })
  })
)

router.delete(
  '/accounts/:id',
  auth(),
  validate(deleteById),
  guard(async (req: DeleteByIdRequest, res: Response) => {
    const rowsDeleted = await db('accounts').where('id', req.params.id).del()
    if (!rowsDeleted) return res.sendStatus(404)

    return res.sendStatus(200)
  })
)

export { router as accounts }
