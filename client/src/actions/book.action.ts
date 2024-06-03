import { ValidatedQuery } from 'hooks/useValidation'
import { Options } from './types'

export function getBooks<TRequest extends Record<string, unknown>, TResponse>(
  query: ValidatedQuery,
  options: Options<TRequest, TResponse>,
) {
  const { url, schema, data, resSchema } = options
  return query(url, schema, data, resSchema)
}
