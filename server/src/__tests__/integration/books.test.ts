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

function createMockBooks(counts: number) {
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

test.skip('create books', async () => {
  const books = createMockBooks(500)
  const response = await doAuth(agent.post('/books/bulk').send(books))
  expect(response.status).toBe(200)
})

test('check which one is slower', async () => {
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