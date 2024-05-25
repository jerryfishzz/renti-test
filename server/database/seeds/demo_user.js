/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()

  await knex('accounts').insert([{ username: 'renti', password: 'renti' }])
}
