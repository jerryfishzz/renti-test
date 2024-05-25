exports.up = function (knex) {
  return knex.schema.table('accounts', function (table) {
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.table('accounts', function (table) {
    table.dropColumn('updated_at')
  })
}
