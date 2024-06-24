import { guard, router } from './utils'
import validate from 'lib/validate'
import { db } from 'lib/db'
import {
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionsByAccountIdResponse,
  GetSessionsByIdResponse,
  createSession,
} from 'schemas/session.schema'
import { GetParamsIdRequest, getParamsId } from 'schemas/shared.schema'

router.post(
  '/sessions',
  validate(createSession),
  guard(async (req: CreateSessionRequest, res: CreateSessionResponse) => {
    const [session] = await db('sessions').insert(req.body).returning('*')

    return res.send(session)
  })
)

router.get(
  '/sessions/:id',
  validate(getParamsId),
  guard(async (req: GetParamsIdRequest, res: GetSessionsByIdResponse) => {
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

export { router as sessions }
