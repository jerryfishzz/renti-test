import request, { Test } from 'supertest'
import { faker } from '@faker-js/faker'

import app from 'lib/express'
import { accounts } from 'api/accounts'
import { books } from 'api/books'
import { db } from 'lib/db'
import { CreateBook } from 'schemas/book.schema'
import { createDoAuth, logIn } from './utils'

app.use(accounts)
app.use(books)
const agent = request(app)
let doAuth: (test: Test) => Test

function createMockBooks(counts: number = 1) {
  const books: CreateBook[] = []
  for (let i = 0; i < counts; i++) {
    const book: CreateBook = {
      title: faker.lorem.words({ min: 1, max: 4 }),
      author: faker.person.fullName(),
      genre_id: faker.number.int({ min: 1, max: 15 }),
      cover_image: faker.image.url(),
    }
    books.push(book)
  }
  return books
}

beforeAll(async () => {
  const login = await logIn(agent)
  doAuth = createDoAuth(login)
})

afterAll(async () => {
  await db.destroy()
})

test('get books', async () => {
  const response = await doAuth(agent.get('/books/account/1'))
})

test('create a book', async () => {
  const book = createMockBooks()[0]
  const response = await doAuth(agent.post('/books').send(book))

  expect(response.body).toEqual({
    ...book,
    id: expect.any(Number),
    created_at: expect.any(String),
  })
})

test('create books', async () => {
  const books = createMockBooks(10)
  const response = await doAuth(agent.post('/books/bulk').send(books))

  expect(response.body.length).toEqual(10)
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
