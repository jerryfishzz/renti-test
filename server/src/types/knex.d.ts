import { Account } from './db'

declare module 'knex/types/tables.js' {
  interface Tables {
    accounts: Account
  }
}
