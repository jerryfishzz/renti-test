exports.up = function (knex) {
  return knex.schema.table('accounts', function (table) {
    table.string('name')
    table.string('email').notNullable()
    table.jsonb('reading_preferences').defaultTo(JSON.stringify([]))
  })
}

exports.down = function (knex) {
  return knex.schema.table('accounts', function (table) {
    table.dropColumn('name')
    table.dropColumn('email')
    table.dropColumn('reading_preferences')
  })
}
