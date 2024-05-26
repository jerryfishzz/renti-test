import request from 'supertest'

import app from 'lib/express'
import { accounts } from 'api/accounts'
import Account from './models/account'
import { db } from 'lib/db'

app.use(accounts)
const agent = request(app)

let test_acct: Account = null as unknown as Account

beforeEach(async () => {
  test_acct = new Account(agent)
  await test_acct.create()
})

afterEach(async () => {
  await test_acct.delete()
  test_acct = null as unknown as Account
})

afterAll(async () => {
  await db.destroy()
})

test(`log in succeeds`, async () => {
  const { username, password } = test_acct.json
  const response = await agent.post('/login').send({ username, password })
  expect(response.status).toBe(200)
})
