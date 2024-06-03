import { z } from 'zod'

export type Options<TRequest extends Record<string, unknown>, TResponse> = {
  url: string
  schema?: z.Schema<TRequest>
  data?: unknown
  resSchema: z.Schema<TResponse>
}
