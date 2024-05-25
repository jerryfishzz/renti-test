const bcrypt = require('bcrypt')

const { SALT_ROUNDS } = process.env

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()

  const hashed = await bcrypt.hash('renti', Number(SALT_ROUNDS))
  await knex('accounts').insert([{ username: 'renti', password: hashed }])
}
