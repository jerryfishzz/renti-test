import request, { Test } from 'supertest'

import app from 'lib/express'
import { accounts } from 'api/accounts'
import { books } from 'api/books'
import { db } from 'lib/db'

const { API_USER, API_PASS } = process.env

app.use(accounts)
app.use(books)
const agent = request(app)
let access_token = ''
let doAuth: any

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
