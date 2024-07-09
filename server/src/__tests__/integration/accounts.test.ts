import { db } from 'lib/db'
import { logIn } from './utils'
import * as AccountService from './services/account.service'
import * as SessionService from './services/session.service'
import { AccountReturn } from 'schemas/account.schema'

let sessionId: number
const { API_USER } = process.env

beforeAll(async () => {
  sessionId = await logIn()
})

afterAll(async () => {
  await SessionService.deleteById(sessionId)
  await db.destroy()
})

describe('accounts', () => {
  describe('get account by id', () => {
    let account: AccountReturn | null = null

    beforeEach(async () => {
      const { body } = await AccountService.create()
      account = body
    })

    afterEach(async () => {
      if (account) {
        await AccountService.deleteById(account.id)
        account = null
      }
    })

    describe('given the account id does not exist', () => {
      it('should return 404', async () => {
        const notFoundId = account!.id
        await AccountService.deleteById(notFoundId)
        account = null

        const { statusCode } = await AccountService.getById(notFoundId)

        expect(statusCode).toBe(404)
      })
    })

    describe('given the account id exists', () => {
      it('should return the account info', async () => {
        const { statusCode, body } = await AccountService.getById(account!.id)

        expect(statusCode).toBe(200)
        expect(body).toEqual(account)
      })
    })
  })

  describe('get account by username', () => {
    describe('given the account username does not exist', () => {
      let account: AccountReturn | null = null

      beforeEach(async () => {
        const { body } = await AccountService.create()
        account = body
      })

      afterEach(async () => {
        if (account) {
          await AccountService.deleteById(account.id)
          account = null
        }
      })

      it('should return 404', async () => {
        const notFoundUsername = account!.username
        await AccountService.deleteById(account!.id)
        account = null

        const { statusCode } = await AccountService.getByUsername(
          notFoundUsername
        )

        expect(statusCode).toBe(404)
      })
    })

    describe('given the account username exists', () => {
      it('should return the account info', async () => {
        const { statusCode, body } = await AccountService.getByUsername(
          API_USER
        )

        expect(statusCode).toBe(200)
        expect(body.username).toEqual(API_USER)
      })
    })
  })

  describe('get list', () => {
    describe('given there is at least one account in the table', () => {
      let account: AccountReturn | null = null

      beforeEach(async () => {
        const { body } = await AccountService.create()
        account = body
      })

      afterEach(async () => {
        if (account) {
          await AccountService.deleteById(account.id)
          account = null
        }
      })

      it('should return an array with the length greater than 0', async () => {
        const response = await AccountService.getList()

        expect(response.body.length).toBeGreaterThan(0)
      })
    })
  })

  describe('create account', () => {
    describe('given the username already exists', () => {
      it('should return 500', async () => {
        const newAccount = AccountService.createMockAccount({
          username: API_USER,
        })

        const { statusCode } = await AccountService.create(newAccount)

        expect(statusCode).toBe(500)
      })
    })

    describe('given the account info is correct', () => {
      let account: AccountReturn | null = null

      afterEach(async () => {
        if (account) {
          await AccountService.deleteById(account.id)
          account = null
        }
      })

      it('should return the newly created account info', async () => {
        const newAccount = AccountService.createMockAccount()
        const { password, ...newAccountWithoutPassword } = newAccount

        const { body } = await AccountService.create(newAccount)
        account = body

        expect(body).toEqual({
          ...newAccountWithoutPassword,
          id: expect.any(Number),
        })
      })
    })
  })
})
