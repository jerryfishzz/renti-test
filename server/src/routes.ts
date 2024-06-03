import { Express } from 'express'

import { accounts } from './api/accounts'
import { genres } from 'api/genres'
import { books } from 'api/books'

export default function routes(app: Express) {
  app.use(accounts)
  app.use(genres)
  app.use(books)
}
