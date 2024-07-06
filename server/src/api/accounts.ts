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
  GetListResponse,
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

router.get(
  '/accounts',
  auth(),
  guard(async (req, res: GetListResponse) => {
    const accounts = await db('accounts').returning('*')

    return res.send(accounts)
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
    const accessExp = addHours(new Date(), 1).getTime() / 1000
    const refreshExp = addDays(new Date(), 14).getTime() / 1000

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

    // Issue access token and refresh token
    const cookieSessionId = req.cookies?.sessionId as undefined | number
    let isValid = false
    let session: Session | undefined

    if (cookieSessionId)
      session = await db('sessions').where('id', cookieSessionId).first()

    if (session) {
      try {
        const sub = verify(session.refresh_token)

        // Update session cookie
        addSessionCookie(res, session.id, new Date(sub.exp * 1000))
        isValid = true
      } catch (e) {
        console.error(e)
      }
    }

    if (session && isValid) {
      const access_token = createToken(account.id, accessExp)

      return res.send({
        sessionId: session.id,
        ...account,
        access_token,
      })
    } else {
      const refresh_token = createToken(account.id, refreshExp)

      const [session] = await db('sessions')
        .insert({
          account_id: account.id,
          refresh_token,
        })
        .returning('*')
      if (!session) return res.sendStatus(500)

      // Check the existing expired sessions and delete them
      await deleteExpiredSessions(account.id)

      // Set the cookie with the session ID
      addSessionCookie(res, session.id, addDays(new Date(), 14))

      const access_token = createToken(account.id, accessExp)

      return res.send({
        sessionId: session.id,
        ...account,
        access_token,
      })
    }
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

async function deleteExpiredSessions(accountId: number) {
  try {
    const existingSessions = await db('sessions').where('account_id', accountId)
    const expiredSessions: Session[] = []
    console.log(existingSessions)

    for (const session of existingSessions) {
      console.log('in the loop')
      try {
        verify(session.refresh_token)
      } catch (error) {
        console.error(error)
        expiredSessions.push(session)
      }
    }

    if (expiredSessions.length) {
      await db('sessions')
        .whereIn(
          'id',
          expiredSessions.map(s => s.id)
        )
        .del()
    }
  } catch (error) {
    // Only output the error, but not stop the login process
    console.error(error)
  }
}

function createToken(accountId: number, exp: number) {
  return sign({
    id: accountId,
    iat: new Date().getTime() / 1000,
    exp,
  })
}

function addSessionCookie(res: Response, sessionId: number, expires: Date) {
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    expires,
  })
}

export { router as accounts }
