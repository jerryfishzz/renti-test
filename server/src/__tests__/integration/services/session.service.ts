import { Session } from 'types/db'
import { query, Response } from '../utils'

export function getById(id: number): Promise<Response<Session>> {
  return query({ path: `/sessions/${id}` })
}

export function deleteById(id: number): Promise<Response<string>> {
  return query({ path: `/sessions/${id}`, options: { method: 'delete' } })
}
