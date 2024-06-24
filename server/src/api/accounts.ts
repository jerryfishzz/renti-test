import { addDays, addHours } from 'date-fns'
import bcrypt from 'bcryptjs'
import { Response } from 'express'

import { db } from 'lib/db'
import { auth, sign, verify } from 'lib/jwt'
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
    // Validate username and password
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

    // First time login or session expired
    if (!req.cookies?.sessionId) {
      const refresh_token = sign({
        id: account.id,
        iat: new Date().getTime() / 1000,
        exp: addDays(new Date(), 14).getTime() / 1000, // 2 weeks
      })

      const [session] = await db('sessions')
        .insert({
          account_id: account.id,
          refresh_token,
        })
        .returning('*')
      const sessionId = (session as Session).id.toString()

      // Set the cookie with the session ID
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        expires: addDays(new Date(), 14), // 2 weeks
      })

      const access_token = sign({
        id: account.id,
        iat: new Date().getTime() / 1000, // Current time
        exp: addHours(new Date(), 1).getTime() / 1000, // Expiring time = current time + 1 hour
      })

      return res.send({
        ...account,
        access_token,
      })
    } else {
      const sessionId = Number(req.cookies.sessionId as string)
      const session = await db('sessions').where('id', sessionId).first()

      let isValid = true
      if (session) {
        try {
          const sub = verify(session.refresh_token)

          res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            expires: new Date(sub.exp * 1000),
          })
        } catch (e) {
          console.error(e)
          isValid = false
        }
      }

      if (session && isValid) {
        const access_token = sign({
          id: account.id,
          iat: new Date().getTime() / 1000, // Current time
          exp: addHours(new Date(), 1).getTime() / 1000, // Expiring time = current time + 1 hour
        })

        return res.send({
          ...account,
          access_token,
        })
      } else {
        console.log('db error')
        const refresh_token = sign({
          id: account.id,
          iat: new Date().getTime() / 1000,
          exp: addDays(new Date(), 14).getTime() / 1000, // 2 weeks
        })

        const [session] = await db('sessions')
          .insert({
            account_id: account.id,
            refresh_token,
          })
          .returning('*')
        const sessionId = (session as Session).id.toString()

        // Set the cookie with the session ID
        res.cookie('sessionId', sessionId, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'strict',
          expires: addDays(new Date(), 14), // 2 weeks
        })

        const access_token = sign({
          id: account.id,
          iat: new Date().getTime() / 1000, // Current time
          exp: addHours(new Date(), 1).getTime() / 1000, // Expiring time = current time + 1 hour
        })

        return res.send({
          ...account,
          access_token,
        })
      }
    }

    // TODO: create a new session if the current session from the cookie cannot be found in the database
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
