exports.up = function (knex) {
  return knex.schema.table('reading_lists', function (table) {
    table.dropForeign('book_id')
    table
      .foreign('book_id')
      .references('id')
      .inTable('books')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex) {
  return knex.schema.table('reading_lists', function (table) {
    table.dropForeign('book_id')
    table.foreign('book_id').references('id').inTable('books')
  })
}
