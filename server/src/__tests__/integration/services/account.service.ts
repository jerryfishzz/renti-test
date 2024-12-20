import { faker } from '@faker-js/faker'

import { query, Response } from '../utils'
import {
  CreateAccount,
  AccountReturn,
  LoginReturn,
} from 'schemas/account.schema'

export function createMockAccount(
  mockAccount: Partial<CreateAccount> = {}
): CreateAccount {
  return {
    username: faker.string.uuid(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    reading_preferences: ['Fantasy'],
    ...mockAccount,
  }
}

export function getById(id: number): Promise<Response<AccountReturn>> {
  return query({ path: `/accounts/${id}` })
}

export function getByUsername(
  username: string
): Promise<Response<AccountReturn>> {
  return query({ path: `/accounts/username/${username}` })
}

export function getList(): Promise<Response<AccountReturn[]>> {
  return query({ path: '/accounts' })
}

export function create(
  account?: CreateAccount
): Promise<Response<AccountReturn>> {
  return query({
    path: '/accounts',
    options: { method: 'post', body: account ? account : createMockAccount() },
  })
}

export function logIn(
  username: string,
  password: string,
  cookie?: string[]
): Promise<Response<LoginReturn>> {
  return query({
    path: '/login',
    options: { method: 'post', body: { username, password } },
    cookie,
  })
}

export function deleteById(id: number): Promise<Response<string>> {
  return query({ path: `/accounts/${id}`, options: { method: 'delete' } })
}
