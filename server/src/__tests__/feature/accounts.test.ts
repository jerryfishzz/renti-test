import request from 'supertest'

import Account from './models/account'
import app from '../../lib/express'

test(`log in`, async () => {
  // const account = new Account()
  // let json = await account.readByUsername('booklover1')
  // expect(json.userName).toEqual('booklover1')

  const response = await request(app).get('/')
  expect(response.status).toBe(200)
  expect(response.text).toEqual('Hello, World!')
})
