import knex from 'knex'
// import { attachPaginate } from 'knex-paginate'
// import config from '../../knexfile.js'

// Update with your config settings.
export const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'postgres',
  POSTGRES_PORT = 5432,
  POSTGRES_DATABASE = 'postgres',
} = process.env

/*
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
}
// attachPaginate()
knex.QueryBuilder.extend('softDelete', function () {
  const toUpdate = {
    status: 'deleted',
    deleted_at: new Date(),
  }
  // @ts-ignore
  this.update(toUpdate)
  return this
})

export const db = knex(config)

export default config
