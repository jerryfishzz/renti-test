import { query } from 'lib/query'
import { LoginResponse } from 'schemas/auth.schema'

export async function doLogIn(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await query('/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
