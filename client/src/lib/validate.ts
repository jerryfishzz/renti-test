import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export function validate<T>(schema: z.Schema<T>, data: unknown) {
  try {
    const result = schema.safeParse(data)
    if (!result.success) throw result.error
    return result.data
  } catch (e) {
    const validationError = fromZodError(e as z.ZodError)
    throw Error(validationError.message)
  }
}
