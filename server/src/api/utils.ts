import { Request, Response, Router } from 'express'

export function guard(fn: (req: Request<any>, res: Response) => Promise<any>) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res)
    } catch (e) {
      console.error(e)
      return res.sendStatus(500)
    }
  }
}

export const router = Router({ mergeParams: true })
