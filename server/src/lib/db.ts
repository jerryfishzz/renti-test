import knex from 'knex'
// import { attachPaginate } from 'knex-paginate'

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'postgres',
  },
}

// attachPaginate()

export const db = knex(config)

export default config
