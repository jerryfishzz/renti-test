import { Account } from 'types/db'
import { jsonQuery } from '../utils'

export function getById(id: number): Promise<Account[]> {
  return jsonQuery({ path: `/accounts/${id}` })
}

export function readList(): Promise<Account[]> {
  return jsonQuery({ path: '/accounts' })
}
