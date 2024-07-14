import { faker } from '@faker-js/faker'
import { addDays, addHours } from 'date-fns'

import * as AccountService from './services/account.service'
import * as SessionService from './services/session.service'
import { db } from 'lib/db'
import { AccountReturn } from 'schemas/account.schema'
import { logIn } from './utils'

// Wait async function to pause for certain amount of time
function wait(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

jest.setTimeout(1000 * 60 * 10)

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  addDays: jest.fn(),
  addHours: jest.fn(),
}))

const { API_USER } = process.env

const accessExpDate = new Date()
accessExpDate.setHours(accessExpDate.getHours() + 1)
const refreshExpDate = new Date()
refreshExpDate.setDate(refreshExpDate.getDate() + 14)

afterAll(async () => {
  await db.destroy()
})

describe('log in', () => {
  describe('given the username does not exist', () => {
    it('should return 403', async () => {
      const { username, password } = AccountService.createMockAccount()

      const { statusCode } = await AccountService.logIn(username, password)

      expect(statusCode).toBe(403)
    })
  })

  describe('given the username and password are incorrect', () => {
    it('should return 403', async () => {
      const { statusCode } = await AccountService.logIn(
        API_USER,
        faker.string.uuid()
      )

      expect(statusCode).toBe(403)
    })
  })

  describe('login logic', () => {
    let username: string = ''
    let password: string = ''
    let account: AccountReturn | null = null
    let sessionId: number = 0
    let adminSessionId: number = 0

    beforeEach(async () => {
      // @ts-ignore
      addHours.mockReturnValue(accessExpDate)
      // @ts-ignore
      addDays.mockReturnValue(refreshExpDate)

      // Log in as admin manually to get admin session id.
      // So after the test, we can delete the session.
      // AccountService.create below can log in automatically as admin,
      // but can't get the session id from that api.
      // Note, can't use AccountService.logIn
      // because it won't create access token for tests.
      // Check query in utils for detail.
      adminSessionId = await logIn()

      const newAccount = AccountService.createMockAccount()
      username = newAccount.username
      password = newAccount.password

      // Log in as admin
      const { body } = await AccountService.create(newAccount)
      account = body
    })

    afterEach(async () => {
      if (sessionId) {
        await SessionService.deleteById(sessionId)
        sessionId = 0
      }

      if (adminSessionId) {
        await SessionService.deleteById(adminSessionId)
        adminSessionId = 0
      }

      // Need to delete after session is deleted since it's a foreign key
      if (account) {
        await AccountService.deleteById(account.id)
        account = null
      }
      username = ''
      password = ''
    })

    describe('given the account logs in first time', () => {
      it('should return session id, user info, and access token', async () => {
        const { statusCode, body } = await AccountService.logIn(
          username,
          password
        )
        sessionId = body.sessionId

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          ...account,
          access_token: expect.any(String),
          sessionId: expect.any(Number),
        })
      })
    })

    describe('given session cookie is expired', () => {
      let lastSessionId: number = 0

      afterEach(async () => {
        if (lastSessionId) {
          await SessionService.deleteById(lastSessionId)
          lastSessionId = 0
        }
      })

      it('should delete the expired session and return user info, access token, and newly created session id', async () => {
        // The mock in beforeAll won't work here, but beforeEach works

        // @ts-ignore
        addDays.mockReturnValueOnce(new Date(Date.now() + 100))

        const { body: lastBody } = await AccountService.logIn(
          username,
          password
        )
        lastSessionId = lastBody.sessionId

        const lastResponse = await SessionService.getById(lastSessionId)

        expect(lastResponse.body.id).toBe(lastSessionId)

        // Wait long enough till last session expires
        await wait(2000)

        const { statusCode, body } = await AccountService.logIn(
          username,
          password
        )
        sessionId = body.sessionId

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          ...account,
          access_token: expect.any(String),
          sessionId: expect.any(Number),
        })

        const response = await SessionService.getById(lastSessionId)

        expect(response.statusCode).toBe(404)

        lastSessionId = 0
      })
    })
  })
})
