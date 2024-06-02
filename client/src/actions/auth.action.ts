import query from 'lib/query'
import { LoginResponse, loginRequest } from 'schemas/auth.schema'

export async function doLogIn(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    return await query.post('/login', loginRequest, {
      username,
      password,
    })

    // const data = await response.json()
    // return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
