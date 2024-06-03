import { Account, Book, Genre } from './db'

declare module 'knex/types/tables.js' {
  interface Tables {
    accounts: Account
    genres: Genre
    books: Book
  }
}
