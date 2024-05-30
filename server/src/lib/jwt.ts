import jwt from 'jsonwebtoken'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'

const { JWT_PRIVATE_KEY_PATH, JWT_PRIVATE_KEY_MATERIAL } = process.env

function getJwtMaterial() {
  let jwtMaterialBuffer: Buffer
  if (JWT_PRIVATE_KEY_MATERIAL) {
    jwtMaterialBuffer = Buffer.from(JWT_PRIVATE_KEY_MATERIAL)
  } else if (JWT_PRIVATE_KEY_PATH) {
    jwtMaterialBuffer = fs.readFileSync(JWT_PRIVATE_KEY_PATH)
  } else {
    throw new Error(
      'Either JWT_PRIVATE_KEY_PATH or JWT_PRIVATE_KEY_MATERIAL must be set'
    )
  }
  return jwtMaterialBuffer
}

type Payload = {
  id: number
  isAuthenticated: boolean
  iat: number
  exp: number
}
export const sign = (payload: Payload) => {
  const jwtMaterial = getJwtMaterial()
  return jwt.sign(payload, jwtMaterial, { algorithm: 'RS256' })
}

export const verify = (access_token: string) => {
  const jwtMaterial = getJwtMaterial()
  return jwt.verify(access_token, jwtMaterial)
}

export const auth =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    // Token from query or header
    const access_token = req.header('Authorization') || null
    if (!access_token) return res.sendStatus(403)

    try {
      // Token valid and correct role
      const sub = verify(access_token.replace('Bearer ', ''))
      if (typeof sub === 'string' || !sub.isAuthenticated)
        return res.sendStatus(403)

      next()
    } catch (e) {
      console.error(e)
      return res.sendStatus(403)
    }
  }
