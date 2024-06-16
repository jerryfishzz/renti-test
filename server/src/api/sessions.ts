import { auth } from 'lib/jwt'
import { guard, router } from './utils'
import validate from 'lib/validate'
import { db } from 'lib/db'
import {
  CreateSessionRequest,
  CreateSessionResponse,
  createSession,
} from 'schemas/session.schema'

router.post(
  '/sessions',
  validate(createSession),
  guard(async (req: CreateSessionRequest, res: CreateSessionResponse) => {
    const [session] = await db('sessions').insert(req.body).returning('*')

    return res.send(session)
  })
)

export { router as sessions }
