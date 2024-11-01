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

describe('/login', () => {
  describe('Login-1-f-1: given the username does not exist', () => {
    it('should return 403', async () => {
      const { username, password } = AccountService.createMockAccount()

      const { statusCode } = await AccountService.logIn(username, password)

      expect(statusCode).toBe(403)
    })
  })

  describe('Login-1-f-2: given the password is incorrect', () => {
    it('should return 403', async () => {
      const { statusCode } = await AccountService.logIn(
        API_USER,
        faker.string.uuid()
      )

      expect(statusCode).toBe(403)
    })
  })

  describe('login logic after username and password passed', () => {
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

      // Act as admin
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

    describe('Login-2-f: given the use logs in first time', () => {
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

    describe('Tests that need to log in twice by the same username/password pair', () => {
      let lastSessionId: number = 0

      afterEach(async () => {
        if (lastSessionId) {
          await SessionService.deleteById(lastSessionId)
          lastSessionId = 0
        }
      })

      describe('Login-3-f-1: given the session in db is expired', () => {
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

          // Reset lastSessionId to avoid running contents in afterEach
          // since it has been deleted successfully
          lastSessionId = 0
        })
      })

      describe('Login-3-f-2: given the session in db does not exist anymore', () => {
        it('should return user info, access token, and newly created session id', async () => {
          const { body: lastBody } = await AccountService.logIn(
            username,
            password
          )
          lastSessionId = lastBody.sessionId

          await SessionService.deleteById(lastSessionId)
          const lastResponse = await SessionService.getById(lastSessionId)

          expect(lastResponse.statusCode).toBe(404)

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
          expect(sessionId).not.toBe(lastSessionId)

          lastSessionId = 0
        })
      })

      describe('Login-3-t: given the user already logged in before and attempts to log in again while its session cookie in db is not expired', () => {
        it('should return the same session id the second time', async () => {
          const { header, body: lastBody } = await AccountService.logIn(
            username,
            password
          )
          lastSessionId = lastBody.sessionId

          const { body } = await AccountService.logIn(
            username,
            password,
            header['set-cookie'] as unknown as string[]
            // Manually set the same cookie as the first login to simulate the testing scenario
          )
          sessionId = body.sessionId

          expect(lastSessionId).toBe(sessionId)

          // Avoid duplicate deleting since it's the same session
          lastSessionId = 0
        })
      })
    })
  })
})
