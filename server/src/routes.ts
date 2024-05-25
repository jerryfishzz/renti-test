import { Express } from 'express'

import { accounts } from './api/accounts'

export default function routes(app: Express) {
  app.use(accounts)
}
