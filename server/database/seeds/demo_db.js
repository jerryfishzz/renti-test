const bcrypt = require('bcryptjs')

const { SALT_ROUNDS } = process.env

const accounts = [
  {
    id: 1,
    username: 'booklover1',
    email: 'booklover1@example.com',
    password: 'hashedpassword1',
    profile: {
      name: 'Alice Johnson',
      reading_preferences: ['Fiction', 'Mystery', 'Science Fiction'],
    },
  },
  {
    id: 2,
    username: 'literaturefan',
    email: 'literaturefan@example.com',
    password: 'hashedpassword2',
    profile: {
      name: 'Bob Smith',
      reading_preferences: ['Non-Fiction', 'Biography', 'History'],
    },
  },
  {
    id: 3,
    username: 'novelenthusiast',
    email: 'novelenthusiast@example.com',
    password: 'hashedpassword3',
    profile: {
      name: 'Charlie Brown',
      reading_preferences: ['Fantasy', 'Adventure', 'Young Adult'],
    },
  },
]

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()
  await knex('genres').del()

  // Accounts
  for (const account of accounts) {
    const {
      username,
      password,
      email,
      profile: { name, reading_preferences },
    } = account
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hashed = bcrypt.hashSync(password, salt)
    await knex('accounts').insert({
      username,
      password: hashed,
      email,
      name,
      reading_preferences: JSON.stringify(reading_preferences),
    })
  }

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
