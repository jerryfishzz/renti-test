// import 'dotenv/config'
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
export default {
  client: 'pg',
  connection: {
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    database: POSTGRES_DATABASE,
  },
  // pool: {
  //   min: 2,
  //   max: 10
  // },
  migrations: {
    directory: './database/migrations/',
  },
  seeds: {
    directory: './database/seeds',
  },
}
