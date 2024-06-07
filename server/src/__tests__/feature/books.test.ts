import request, { Test } from 'supertest'
import { faker } from '@faker-js/faker'

import app from 'lib/express'
import { accounts } from 'api/accounts'
import { books } from 'api/books'
import { db } from 'lib/db'
import { CreateBook } from 'schemas/book.schema'

const { API_USER, API_PASS } = process.env

app.use(accounts)
app.use(books)
const agent = request(app)
let access_token = ''
let doAuth: any

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
  const login = (await agent
    .post('/login')
    .send({ username: API_USER, password: API_PASS })) as any
  access_token = login.body.access_token
  doAuth = (test: Test) => {
    return test
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
  }
})

afterAll(async () => {
  await db.destroy()
})

test(`get books`, async () => {
  const response = await doAuth(agent.get('/books/account/1'))
  console.log(response.body)
})

test(`create books`, async () => {
  const books = createMockBooks(100)
  const response = await doAuth(agent.post('/books/bulk').send(books))
  expect(response.status).toBe(200)
})
