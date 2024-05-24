require('dotenv').config()

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  // development: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './dev.sqlite3'
  //   }
  // },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

  client: 'pg',
  // connection: {
  //   host: 'localhost',
  //   user: 'postgres',
  //   password: 'postgres',
  //   port: 5432,
  //   database: 'postgres',
  // },

  connection: process.env.DATABASE_URL,
  // connection: 'postgres://postgres:postgres@db:5432/postgres',
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
