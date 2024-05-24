// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'postgres',
  },
  migrations: {
    directory: './database/migrations/',
  },
  seeds: {
    directory: './database/seeds',
  },
}
