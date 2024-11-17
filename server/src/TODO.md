# TODO List

## High

- [ ] Add tests for the accounts api
- [ ] Return from account query should not include password

## Medium

- [ ] Re-create access token when the current one is expired but refresh token is still valid
- [ ] Check the deleting endpoints for the universal return type
- [ ] Explicitly type `guard` function
- [ ] Add pagination to all the get endpoints
- [ ] Should user in login response be an individual prop like:

  ```json
  {
    "user": {
      "id": 1,
      "email": "jerry@jk.cm"
    }
  }
  ```

- [✔️] Check if `db.destroy()` is still necessary _Yes_
- [ ] Simplify return type of tables
- [ ] Change all the created_at and updated_at to coerce date type
- [ ] Session API should not be directly used by normal users but only for admin. Its auth should be admin only.
- [ ] Add soft delete
- [ ] Add RLS
- [ ] Remove cascade delete
- [ ] Should check other returned fields in get user by username endpoint
- [ ] Add tests for delete user by id

## Low

- [ ] Standardized module exports
- [ ] Remove models folder and its jest settings
- [ ] Add package version check tools
- [ ] Add authorization in auth middleware
- [ ] jsonwebtoken can't work with docker
- [ ] Remove sum.ts
