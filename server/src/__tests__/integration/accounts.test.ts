// import Account from './models/account'
import { db } from 'lib/db'
import { logIn } from './utils'
import * as AccountService from './services/account.service'
import * as SessionService from './services/session.service'
import { Account } from 'types/db'
import { faker } from '@faker-js/faker'
import { Response } from './utils'

let sessionId: number
const { API_USER, API_PASS } = process.env

// let test_acct: Account = null as unknown as Account

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

describe('accounts', () => {
  describe('get account by id', () => {
    describe('given the account id does not exist', () => {
      it('should return 404', async () => {
        const notFoundId = await createNotFound({
          getList: () => AccountService.getList(),
          key: 'id',
          createMockValue: () => Math.floor(Math.random() * 1000),
        })

        const { statusCode } = await AccountService.getById(notFoundId)
        expect(statusCode).toBe(404)
      })
    })

    describe('given the account id exists', () => {
      let account: Account | null = null

      beforeEach(async () => {
        const { body } = await AccountService.create()
        account = body
      })

      afterEach(async () => {
        await AccountService.deleteById(account!.id)
        account = null
      })

      it('should return the account info', async () => {
        const { statusCode, body } = await AccountService.getById(account!.id)

        expect(statusCode).toBe(200)
        expect(body).toEqual(account)
      })
    })
  })

  describe('get account by username', () => {
    describe('given the account username does not exist', () => {
      it('should return 404', async () => {
        const notFoundUsername = faker.internet.userName()
        const mockGetByUsername = jest
          .spyOn(AccountService, 'getByUsername')
          // @ts-ignore
          .mockReturnValueOnce({ statusCode: 404 })

        const { statusCode } = await AccountService.getByUsername(
          notFoundUsername
        )

        expect(statusCode).toBe(404)
        expect(mockGetByUsername).toHaveBeenCalledWith(notFoundUsername)
      })
    })

    describe('given the account username exists', () => {
      let account: Account | null = null

      beforeEach(async () => {
        const { body } = await AccountService.create()
        account = body
      })

      afterEach(async () => {
        await AccountService.deleteById(account!.id)
        account = null
      })

      it('should return the account info', async () => {
        const { statusCode, body } = await AccountService.getByUsername(
          account!.username
        )

        expect(statusCode).toBe(200)
        expect(body).toEqual(account)
      })
    })
  })

  describe('get list', () => {
    describe('given there is at least one account in the table', () => {
      let account: Account | null = null

      beforeEach(async () => {
        const { body } = await AccountService.create()
        account = body
      })

      afterEach(async () => {
        await AccountService.deleteById(account!.id)
        account = null
      })

      it('should return an array with the length greater than 0', async () => {
        const response = await AccountService.getList()

        expect(response.body.length).toBeGreaterThan(0)
      })
    })
  })
})

type CreateNotFoundProps<
  TObj extends Record<string, any>,
  TKey extends keyof TObj
> = {
  getList: () => Promise<Response<TObj[]>>
  key: TKey
  createMockValue: () => TObj[TKey]
}
async function createNotFound<
  TObj extends Record<string, any>,
  TKey extends keyof TObj
>({ getList, key, createMockValue }: CreateNotFoundProps<TObj, TKey>) {
  let notFound = createMockValue()
  const { body } = await getList()

  let same = true
  while (same) {
    same = body.some(obj => obj[key] === notFound)
    same && (notFound = createMockValue())
  }

  return notFound
}
