import { jsonQuery, textQuery } from '../utils'

export function getById(id: number): Promise<string> {
  return jsonQuery({ path: `/sessions/${id}` })
}

export function deleteById(id: number): Promise<string> {
  return textQuery({ path: `/sessions/${id}`, options: { method: 'delete' } })
}
