import { Response } from 'express'

import { getUserAgent, guard, router } from './utils'
import validate from 'lib/validate'
import { db } from 'lib/db'
import {
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionsByAccountIdResponse,
  GetSessionByIdResponse,
  createSession,
  GetSessionByAccountIdAndUserAgentResponse,
  GetSessionByAccountIdAndUserAgentRequest,
  getSessionByAccountIdAndUserAgent,
} from 'schemas/session.schema'
import { GetParamsIdRequest, getParamsId } from 'schemas/shared.schema'

// So far, all the session endpoints don't need to add auth since they are all dependent on login api

router.get(
  '/sessions/:id',
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: GetSessionByIdResponse) => {
    const session = await db('sessions')
      .where('id', req.params.id)
      .returning('*')
      .first()

    return res.send(session)
  })
)

router.get(
  '/sessions/account/:id',
  validate(getParamsId),
  guard(
    async (req: GetParamsIdRequest, res: GetSessionsByAccountIdResponse) => {
      const sessions = await db('sessions')
        .where('account_id', req.params.id)
        .returning('*')

      return res.send(sessions)
    }
  )
)

router.get(
  '/sessions/account/:account_id/:user_agent',
  validate(getSessionByAccountIdAndUserAgent),
  guard(
    async (
      req: GetSessionByAccountIdAndUserAgentRequest,
      res: GetSessionByAccountIdAndUserAgentResponse
    ) => {
      const session = await db('sessions')
        .where({
          account_id: req.params.account_id,
          user_agent: req.params.user_agent,
        })
        .orderBy('updated_at', 'desc')
        .returning('*')
        .first()
      if (!session) return res.sendStatus(404)

      return res.send(session)
    }
  )
)

router.post(
  '/sessions',
  validate(createSession),
  guard(async (req: CreateSessionRequest, res: CreateSessionResponse) => {
    const [session] = await db('sessions')
      .insert({ ...req.body, user_agent: getUserAgent(req) })
      .returning('*')

    return res.send(session)
  })
)

router.delete(
  '/sessions/:id',
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: Response) => {
    const response = await db('sessions').where('id', req.params.id).del()
    if (response === 0) return res.sendStatus(404)

    return res.sendStatus(200)
  })
)

export { router as sessions }
