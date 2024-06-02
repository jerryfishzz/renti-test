import { ValidatedQuery } from 'hooks/useValidation'
import { LoginResponse, loginRequest } from 'schemas/auth.schema'

type DoLogInProps = {
  data: {
    username: string
    password: string
  }
  validatedQuery: ValidatedQuery
}
export async function doLogIn({
  data: { username, password },
  validatedQuery,
}: DoLogInProps): Promise<LoginResponse> {
  return await validatedQuery('/login', loginRequest, {
    username,
    password,
  })

  // const data = await response.json()
  // return data
}
