import { z } from 'zod'

import { ValidatedQuery } from 'hooks/useValidation'

type Options<
  TRequest extends Record<string, unknown>,
  TResponse extends Record<string, unknown>,
> = {
  url: string
  schema: z.Schema<TRequest>
  data: unknown
  resSchema: z.Schema<TResponse>
}
export function doLogin<
  TRequest extends Record<string, unknown>,
  TResponse extends Record<string, unknown>,
>(query: ValidatedQuery, options: Options<TRequest, TResponse>) {
  const { url, schema, data, resSchema } = options
  return query(url, schema, data, resSchema)
}
