import { addDays, addHours } from 'date-fns'
import bcrypt from 'bcryptjs'
import { Response } from 'express'

import { db } from 'lib/db'
import { auth, sign, verify } from 'lib/jwt'
import { getUserAgent, guard, router } from './utils'
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

router.get(
  '/accounts/:id',
  auth(),
  validate(getById),
  guard(async (req: GetByIdRequest, res: GetByIdResponse) => {
    const account = await db('accounts')
      .where('id', req.params.id)
      .select(['id', 'username', 'email', 'name', 'reading_preferences'])
      .first()
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
      .select(['id', 'username', 'email', 'name', 'reading_preferences'])
      .first()
    if (!account) return res.sendStatus(404)

    return res.send(account)
  })
)

router.get(
  '/accounts',
  auth(),
  guard(async (req, res: GetListResponse) => {
    const accounts = await db('accounts').returning([
      'id',
      'username',
      'email',
      'name',
      'reading_preferences',
    ])

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

    // When inserting into the database, we need to convert the reading_preferences to JSON string
    const reading_preferences = JSON.stringify(req.body.reading_preferences)

    const [account] = await db('accounts')
      // @ts-ignore
      .insert({ ...req.body, password: hashed, reading_preferences })
      .returning(['id', 'username', 'email', 'name', 'reading_preferences'])
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

    // Issue access token and refresh token
    const accessExpDate = addHours(new Date(), 1)
    const refreshExpDate = addDays(new Date(), 14)
    const accessExp = accessExpDate.getTime() / 1000
    const refreshExp = refreshExpDate.getTime() / 1000

    const { id, username, email, name, reading_preferences } = account
    const accountReturn = { id, username, email, name, reading_preferences }

    const cookieSessionId = req.cookies?.sessionId as undefined | number
    let isValid = false
    let session: Session | undefined

    if (cookieSessionId) {
      session = await db('sessions').where('id', cookieSessionId).first()
    } else {
      session = await db('sessions')
        .where({
          account_id: id,
          user_agent: getUserAgent(req),
        })
        .orderBy('updated_at', 'desc')
        .returning('*')
        .first()
    }

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

      try {
        const [updatedSession] = await db('sessions')
          .where('id', session.id)
          .update({
            user_agent: getUserAgent(req),
            updated_at: new Date(),
          })
          .returning(['id', 'account_id', 'user_agent'])

        if (!updatedSession) throw new Error('Update session failed')
      } catch (error) {
        // Update session failed should not stop login process
        console.error(error)
      }

      return res.send({
        sessionId: session.id,
        ...accountReturn,
        access_token,
      })
    } else {
      const refresh_token = createToken(account.id, refreshExp)

      const [newSession] = await db('sessions')
        .insert({
          account_id: account.id,
          refresh_token,
          user_agent: getUserAgent(req),
        })
        .returning('*')
      if (!newSession) return res.sendStatus(500)

      // Check the existing expired sessions and delete them
      await deleteExpiredSessions(account.id)

      // Set the cookie with the session ID
      addSessionCookie(res, newSession.id, refreshExpDate)

      const access_token = createToken(account.id, accessExp)

      return res.send({
        sessionId: newSession.id,
        ...accountReturn,
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

    for (const session of existingSessions) {
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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires,
  })
}

export { router as accounts }
