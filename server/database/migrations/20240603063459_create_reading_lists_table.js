exports.up = function (knex) {
  return knex.schema.createTable('reading_lists', function (table) {
    table.increments('id').primary()
    table
      .integer('account_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('accounts')
    table
      .integer('book_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('books')
    table.string('status').notNullable().defaultTo('want to read')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('reading_lists')
}
