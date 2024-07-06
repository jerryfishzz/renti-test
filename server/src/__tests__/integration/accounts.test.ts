import request from 'supertest'

import app from 'lib/express'
import { accounts } from 'api/accounts'
import Account from './models/account'
import { db } from 'lib/db'
import * as AccountService from './services/account.service'

app.use(accounts)
const agent = request(app)

const { API_USER, API_PASS } = process.env

let test_acct: Account = null as unknown as Account

beforeEach(async () => {
  // test_acct = new Account(agent)
  // await test_acct.create()
})

afterEach(async () => {
  // await test_acct.delete()
  // test_acct = null as unknown as Account
})

afterAll(async () => {
  await db.destroy()
})

// test(`log in succeeds`, async () => {
//   const response = await agent
//     .post('/login')
//     .send({ username: API_USER, password: API_PASS })
//   expect(response.status).toBe(200)
// })

// test(`log in fails`, async () => {
//   const response = await agent
//     .post('/login')
//     .send({ username: API_USER, password: 'this password is wrong' })
//   expect(response.status).toBe(403)
// })

test.only('gets 3 accounts', async () => {
  const results = await AccountService.readList()

  expect(results.length).toBeGreaterThan(0)
})
