import { Express } from 'express'

import { accounts } from './api/accounts'
import { genres } from 'api/genres'
import { books } from 'api/books'
import { reading_lists } from 'api/reading_lists'

export default function routes(app: Express) {
  app.use(accounts)
  app.use(genres)
  app.use(books)
  app.use(reading_lists)
}
