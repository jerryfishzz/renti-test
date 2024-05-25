const bcrypt = require('bcrypt')

const { SALT_ROUNDS } = process.env

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()
  await knex('genres').del()

  // Accounts
  const hashed = await bcrypt.hash('renti', Number(SALT_ROUNDS))
  await knex('accounts').insert([{ username: 'renti', password: hashed }])

  // Genres
  await knex('genres').insert([
    { name: 'Action' },
    { name: 'Adventure' },
    { name: 'Biography' },
    { name: 'Comedy' },
    { name: 'Drama' },
    { name: 'Fantasy' },
    { name: 'Fiction' },
    { name: 'History' },
    { name: 'Horror' },
    { name: 'Mystery' },
    { name: 'Non-Fiction' },
    { name: 'Romance' },
    { name: 'Science Fiction' },
    { name: 'Thriller' },
    { name: 'Young Adult' },
  ])
}
