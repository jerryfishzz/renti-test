import { ValidatedQuery } from 'hooks/useValidation'
import { Options } from './types'

export function doLogin<
  TRequest extends Record<string, unknown>,
  TResponse extends Record<string, unknown>,
>(query: ValidatedQuery, options: Options<TRequest, TResponse>) {
  const { url, schema, data, resSchema } = options
  return query(url, schema, data, resSchema)
}
