import { faker } from '@faker-js/faker'
import { addDays, addHours } from 'date-fns'

import * as AccountService from './services/account.service'
import * as SessionService from './services/session.service'
import { db } from 'lib/db'
import { AccountReturn } from 'schemas/account.schema'

jest.setTimeout(1000 * 60 * 10)

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  addDays: jest.fn(),
  addHours: jest.fn(),
}))

const { API_USER, API_PASS } = process.env

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
    let sessionId: number | null = null

    beforeEach(async () => {
      // @ts-ignore
      addHours.mockReturnValue(accessExpDate)
      // @ts-ignore
      addDays.mockReturnValue(refreshExpDate)

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
        sessionId = null
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
  })
})
