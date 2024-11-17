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
import { getCreateMockBooks } from './services/book.service'

import * as AccountService from './services/account.service'
import * as BookService from './services/book.service'
import * as GenreService from './services/genre.service'
import * as SessionService from './services/session.service'

app.use(accounts)
app.use(books)
app.use(genres)
const agent = request(app)

let doAuth: (test: Test) => Test

type CreateMockBooks = (counts?: number) => Omit<Book, 'id' | 'created_at'>[]
let createMockBooks: CreateMockBooks

let sessionId: number | null = null
const { API_USER } = process.env

beforeAll(async () => {
  sessionId = await logIn()

  const { body } = await GenreService.getList()
  const orderedGenreIds = body
    .map(genre => genre.id)
    .sort((a: number, b: number) => a - b)

  createMockBooks = getCreateMockBooks(
    orderedGenreIds[0]!,
    orderedGenreIds[orderedGenreIds.length - 1]!
  )
})

afterAll(async () => {
  if (sessionId) {
    await SessionService.deleteById(sessionId)
    sessionId = null
  }
  await db.destroy()
})

describe('books', () => {
  test('get books', async () => {
    const {
      body: { id },
    } = await AccountService.getByUsername(API_USER)
    const response = await BookService.getListWithAccountId(id)
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
