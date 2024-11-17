import { query, Response } from '../utils'
import { Genre } from 'types/db'

export function getList(): Promise<Response<Genre[]>> {
  return query({ path: '/genres' })
}
