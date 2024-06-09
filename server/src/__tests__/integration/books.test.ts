import request, { Test } from 'supertest'
import { faker } from '@faker-js/faker'

import app from 'lib/express'
import { accounts } from 'api/accounts'
import { books } from 'api/books'
import { db } from 'lib/db'
import { CreateBook } from 'schemas/book.schema'
import { createDoAuth, logIn } from './utils'
import { genres } from 'api/genres'
import { Book, Genre } from 'types/db'

app.use(accounts)
app.use(books)
app.use(genres)
const agent = request(app)

let doAuth: (test: Test) => Test

type CreateMockBooks = (counts?: number) => Omit<Book, 'id' | 'created_at'>[]
let createMockBooks: CreateMockBooks

function getCreateMockBooks(min: number, max: number) {
  return (counts: number = 1) => {
    const books: CreateBook[] = []
    for (let i = 0; i < counts; i++) {
      const book: CreateBook = {
        title: faker.lorem.words({ min: 1, max: 4 }),
        author: faker.person.fullName(),
        genre_id: faker.number.int({ min, max }),
        cover_image: faker.image.url(),
      }
      books.push(book)
    }
    return books
  }
}

beforeAll(async () => {
  const login = await logIn(agent)
  doAuth = createDoAuth(login)

  const response = await doAuth(agent.get('/genres'))
  const orderedGenreIds = response.body
    .map((genre: Genre) => genre.id)
    .sort((a: number, b: number) => a - b)

  createMockBooks = getCreateMockBooks(
    orderedGenreIds[0],
    orderedGenreIds[orderedGenreIds.length - 1]
  )
})

afterAll(async () => {
  await db.destroy()
})

describe('books', () => {
  test('get books', async () => {
    const response = await doAuth(agent.get('/books/account/1'))
  })

  describe('test create a book then delete it', () => {
    let bookId: string

    test('create a book', async () => {
      const book = createMockBooks()[0]
      const response = await doAuth(agent.post('/books').send(book))
      bookId = response.body.id.toString()

      expect(response.body).toEqual({
        ...book,
        id: expect.any(Number),
        created_at: expect.any(String),
      })
    })

    test('delete the book', async () => {
      const response = await doAuth(agent.delete(`/books/${bookId}`))
      expect(response.status).toBe(200)
    })
  })

  test('create books', async () => {
    const books = createMockBooks(10)
    const response = await doAuth(agent.post('/books/bulk').send(books))

    expect(response.body.length).toEqual(10)
    expect(typeof response.body[0]).toEqual('number')
  })
})

test.skip('create books xx', async () => {
  const books = createMockBooks(2)
  const errorBook = { ...createMockBooks()[0], genre_id: 'jerry' }
  const response = await doAuth(
    agent.post('/books/bulk').send([...books, errorBook])
  )
  // console.log(response.error)
  console.log(response.text)
  // const response = await doAuth(agent.post('/books/bulk').send(books))
  expect(response.status).toBe(200)
})

// For POC test only. Should be skipped.
test.skip('check which one is slower', async () => {
  let combineWin = 0
  let joinWin = 0

  for (let i = 0; i < 100; i++) {
    const combineStart = Date.now()
    await doAuth(agent.get('/books/get-all'))
    const combineEnd = Date.now()
    const combineTime = combineEnd - combineStart

    const joinStart = Date.now()
    await doAuth(agent.get('/books/get-all-join'))
    const joinEnd = Date.now()
    const joinTime = joinEnd - joinStart

    if (combineTime < joinTime) {
      combineWin++
    } else {
      joinWin++
    }
  }
  console.log(`combineWin: ${combineWin}, joinWin: ${joinWin}`)
}, 100000)
