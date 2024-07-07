import { Account } from 'types/db'
import { query, Response } from '../utils'

export function getById(id: number): Promise<Response<Account>> {
  return query({ path: `/accounts/${id}` })
}

export function readList(): Promise<Response<Account[]>> {
  return query({ path: '/accounts' })
}
