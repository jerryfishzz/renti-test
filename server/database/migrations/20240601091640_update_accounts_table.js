exports.up = function (knex) {
  return knex.schema.table('accounts', function (table) {
    table.unique('username')
  })
}

exports.down = function (knex) {
  return knex.schema.table('accounts', function (table) {
    table.dropUnique('username')
  })
}
