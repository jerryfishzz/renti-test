import Account from './models/account'

test(`log in`, async () => {
  const account = new Account()
  let json = await account.readByUsername('booklover1')
  expect(json.userName).toEqual('booklover1')
})
