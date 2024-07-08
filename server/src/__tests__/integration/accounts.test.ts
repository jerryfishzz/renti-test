import Account from './models/account'
import { db } from 'lib/db'
import { logIn } from './utils'
import * as AccountService from './services/account.service'
import * as SessionService from './services/session.service'

let sessionId: number
const { API_USER, API_PASS } = process.env

let test_acct: Account = null as unknown as Account

beforeAll(async () => {
  sessionId = await logIn()
})

beforeEach(async () => {
  // test_acct = new Account(agent)
  // await test_acct.create()
})

afterEach(async () => {
  // await test_acct.delete()
  // test_acct = null as unknown as Account
})

afterAll(async () => {
  await SessionService.deleteById(sessionId)
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

test('gets 3 accounts', async () => {
  const response = await AccountService.getList()

  expect(response.body.length).toBeGreaterThan(0)
})

describe('accounts', () => {
  describe('get account by id', () => {
    describe('given the account id does not exist', () => {
      it('should return 404', async () => {
        let notFoundId = Math.floor(Math.random() * 1000)
        const { body } = await AccountService.getList()

        let same = true
        while (same) {
          same = body.some(account => account.id === notFoundId)
          same && (notFoundId = Math.floor(Math.random() * 1000))
        }

        const { statusCode } = await AccountService.getById(notFoundId)
        expect(statusCode).toBe(404)
      })
    })
  })
})
