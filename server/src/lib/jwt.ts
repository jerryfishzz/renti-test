import jwt from 'jsonwebtoken'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'

const {
  JWT_PRIVATE_KEY_PATH,
  JWT_PRIVATE_KEY_MATERIAL,
  JWT_PUBLIC_KEY_PATH,
  JWT_PUBLIC_KEY_MATERIAL,
} = process.env

type Key = 'public' | 'private'

function getJwtMaterial(key: Key = 'private') {
  let jwtMaterialBuffer: Buffer

  if (key === 'private') {
    if (JWT_PRIVATE_KEY_MATERIAL) {
      jwtMaterialBuffer = Buffer.from(JWT_PRIVATE_KEY_MATERIAL)
    } else if (JWT_PRIVATE_KEY_PATH) {
      jwtMaterialBuffer = fs.readFileSync(JWT_PRIVATE_KEY_PATH)
    } else {
      throw new Error(
        'Either JWT_PRIVATE_KEY_PATH or JWT_PRIVATE_KEY_MATERIAL must be set'
      )
    }
  } else {
    if (JWT_PUBLIC_KEY_MATERIAL) {
      jwtMaterialBuffer = Buffer.from(JWT_PUBLIC_KEY_MATERIAL)
    } else if (JWT_PUBLIC_KEY_PATH) {
      jwtMaterialBuffer = fs.readFileSync(JWT_PUBLIC_KEY_PATH)
    } else {
      throw new Error(
        'Either JWT_PUBLIC_KEY_PATH or JWT_PUBLIC_KEY_MATERIAL must be set'
      )
    }
  }

  return jwtMaterialBuffer
}

type Payload = {
  id: number
  iat: number
  exp: number // Must be the name 'exp' for token expiration
}
export const sign = (payload: Payload) => {
  const jwtMaterial = getJwtMaterial()
  return jwt.sign(payload, jwtMaterial, { algorithm: 'RS256' })
}

export const verify = (access_token: string, key: Key = 'public') => {
  const jwtMaterial = getJwtMaterial(key)
  return jwt.verify(access_token, jwtMaterial) as Payload
}

export const auth = () => (req: Request, res: Response, next: NextFunction) => {
  // Token from query or header
  const access_token = req.header('Authorization') || null
  if (!access_token) return res.sendStatus(403)

  try {
    // Token valid and correct role
    const sub = verify(access_token.replace('Bearer ', ''))

    // TODO: sub can be used for role-based authorization

    next()
  } catch (e) {
    console.error(e)
    return res.sendStatus(403)
  }
}
