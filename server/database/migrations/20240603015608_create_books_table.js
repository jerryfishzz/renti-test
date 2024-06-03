exports.up = function (knex) {
  return knex.schema.createTable('books', function (table) {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.string('author').notNullable()
    table
      .integer('genre_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('genres')
    table.string('cover_image').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('books')
}
