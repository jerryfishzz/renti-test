import { Express } from 'express'

import { router as accounts } from './api/accounts'

export default function routes(app: Express) {
  app.use(accounts)
}
