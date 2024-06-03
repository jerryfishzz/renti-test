import { Account, Book, Genre, Reading_List } from './db'

declare module 'knex/types/tables.js' {
  interface Tables {
    accounts: Account
    genres: Genre
    books: Book
    reading_lists: Reading_List
  }
}
