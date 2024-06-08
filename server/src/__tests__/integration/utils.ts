import TestAgent from 'supertest/lib/agent'
import { Response, Test } from 'supertest'

const { API_USER, API_PASS } = process.env

export async function logIn(agent: TestAgent) {
  return agent.post('/login').send({ username: API_USER, password: API_PASS })
}

export function createDoAuth(login: Response) {
  return (test: Test): Test => {
    return test
      .set('Authorization', `Bearer ${login.body.access_token}`)
      .set('Accept', 'application/json')
  }
}
