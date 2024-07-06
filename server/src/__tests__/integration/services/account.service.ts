import { Account } from 'types/db'
import { jsonQuery } from '../utils'

export function readList(): Promise<Account[]> {
  return jsonQuery({ path: '/accounts' })
}
