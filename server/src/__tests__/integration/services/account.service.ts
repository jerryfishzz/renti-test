import { faker } from '@faker-js/faker'

import { Account } from 'types/db'
import { query, Response } from '../utils'
import { CreateAccount } from 'schemas/account.schema'

const mockAccount: CreateAccount = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  reading_preferences: [],
}

export function getById(id: number): Promise<Response<Account>> {
  return query({ path: `/accounts/${id}` })
}

export function getByUsername(username: string): Promise<Response<Account>> {
  return query({ path: `/accounts/username/${username}` })
}

export function getList(): Promise<Response<Account[]>> {
  return query({ path: '/accounts' })
}

export function create(): Promise<Response<Account>> {
  return query({
    path: '/accounts',
    options: { method: 'post', body: mockAccount },
  })
}

export function deleteById(id: number): Promise<Response<string>> {
  return query({ path: `/accounts/${id}`, options: { method: 'delete' } })
}
