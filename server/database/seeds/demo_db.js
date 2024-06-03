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

const books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre_id: 7,
    cover_image:
      'https://m.media-amazon.com/images/I/81QuEGw8VPL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    id: 2,
    title: 'Becoming',
    author: 'Michelle Obama',
    genre_id: 3,
    cover_image:
      'https://cdn2.penguin.com.au/covers/original/9780241982976.jpg',
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    genre_id: 13,
    cover_image: 'https://d3fa68hw0m2vcc.cloudfront.net/875/277085392.jpeg',
  },
  {
    id: 4,
    title: 'Life of Pi',
    author: 'Yann Martel',
    genre_id: 2,
    cover_image:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQS_pafFWoUZXoaQvYl6CEP9h51XJ4hsqK6DF66qc3wfs7ViMZq',
  },
  {
    id: 5,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre_id: 12,
    cover_image:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSSYdk6Rh5OTsGdysNIEvx39vPpNL-xhWcmCYp1G1TYbd5fY3YB',
  },
  {
    id: 6,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre_id: 9,
    cover_image:
      'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWOvWV-UtYvY2Qu57SAEGFDMsvxmxU3JjUgPh2_6GgS_6rGUyU',
  },
  {
    id: 7,
    title: 'Three-Body Problem',
    author: 'Liu Cixin',
    genre_id: 13,
    cover_image: 'https://d3fa68hw0m2vcc.cloudfront.net/15b/313930051.jpeg',
  },
  {
    id: 8,
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    genre_id: 2,
    cover_image:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRRxdD7tWquroN4RfhCCpDQeOD7q4DnTHqUpp8gdAW9hzhoSftn',
  },
  {
    id: 9,
    title: 'I Am Legend',
    author: 'Richard Matheson',
    genre_id: 9,
    cover_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn2Kg7mIntkbIbwkzEIlVRXSIu-QE4jAhBHJDBZl241_LhaVgG',
  },
  {
    id: 10,
    title: 'Twilight',
    author: 'Stephenie Meyer',
    genre_id: 12,
    cover_image:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTwp7r8tHEhRtCYQtVwjgot9cUNrUGdvszZLInDXwdc94pwVdx6',
  },
  {
    id: 11,
    title: 'Nineteen Eighty-Four',
    author: 'George Orwell',
    genre_id: 7,
    cover_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeglXlBmm240qQ70HEi6CpdgjyevAGT78Vo8iOVtsLnkiDw5pb',
  },
  {
    id: 12,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre_id: 3,
    cover_image:
      'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR2k4P1Mk2oKRRWcncYAbDL6q3mAwbc7hxikLYOF5mgkz1-QwaK',
  },
]

const reading_lists = [
  {
    account_id: 1,
    books: [
      { book_id: 1, status: 'read' },
      { book_id: 3, status: 'currently reading' },
    ],
  },
  {
    account_id: 2,
    books: [{ book_id: 4, status: 'want to read' }],
  },
  {
    account_id: 3,
    books: [
      { book_id: 1, status: 'currently reading' },
      { book_id: 3, status: 'want to read' },
    ],
  },
]

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('reading_lists').del()
  await knex('books').del()
  await knex('genres').del()
  await knex('accounts').del()

  // Accounts
  for (const account of accounts) {
    const {
      username,
      password,
      email,
      profile: { name, reading_preferences },
    } = account
    const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS))
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

  // Books
  for (const book of books) {
    const { title, author, genre_id, cover_image } = book
    await knex('books').insert({
      title,
      author,
      genre_id,
      cover_image,
    })
  }

  // Reading lists
  for (const reading_list of reading_lists) {
    const { account_id, books } = reading_list
    for (const { book_id, status } of books) {
      await knex('reading_lists').insert({
        account_id,
        book_id,
        status,
      })
    }
  }
}
