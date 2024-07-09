import { faker } from '@faker-js/faker'

import * as AccountService from './services/account.service'
import * as SessionService from './services/session.service'
import { db } from 'lib/db'

let sessionId: number | null = null
const { API_USER, API_PASS } = process.env

afterAll(async () => {
  if (sessionId) {
    await SessionService.deleteById(sessionId)
    sessionId = null
  }
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
})
