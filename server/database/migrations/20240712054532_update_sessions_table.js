exports.up = function (knex) {
  return knex.schema.table('sessions', function (table) {
    table.string('user_agent')
  })
}

exports.down = function (knex) {
  return knex.schema.table('sessions', function (table) {
    table.dropColumn('user_agent')
  })
}
