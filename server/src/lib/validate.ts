import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { NextFunction, Request, Response } from 'express'

const validate =
  (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req)
      if (!result.success) throw result.error
      Object.assign(req, result.data)
      return next()
    } catch (e: any) {
      const validationError = fromZodError(e)
      return res.status(422).send(validationError.message)
    }
  }

export default validate
