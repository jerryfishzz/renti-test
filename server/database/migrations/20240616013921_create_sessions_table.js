exports.up = function (knex) {
  return knex.schema.createTable('sessions', function (table) {
    table.increments('id').primary()
    table
      .integer('account_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('accounts')
    table.text('refresh_token').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('sessions')
}
