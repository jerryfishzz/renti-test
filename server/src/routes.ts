import { Express } from 'express'

import { accounts } from './api/accounts'
import { genres } from 'api/genres'

export default function routes(app: Express) {
  app.use(accounts)
  app.use(genres)
}
