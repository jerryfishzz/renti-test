import { faker } from '@faker-js/faker'
import TestAgent from 'supertest/lib/agent'

import { query, jsonQuery, merge } from './util'
import { Account as DBAccount } from 'types/db'

export default class Account {
  private _id: DBAccount['id'] | null
  private _json: Partial<DBAccount>
  private _agent: TestAgent

  constructor(
    agent: TestAgent,
    json: Omit<DBAccount, 'created_at' | 'updated_at'> | null = null
  ) {
    this._id = null
    this._agent = agent

    if (json) {
      this._id = json.id
      this._json = structuredClone(json)
      if (this._json.hasOwnProperty('id')) {
        delete this._json.id
      }
    } else {
      this._json = {
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        reading_preferences: [],
      }
    }
  }

  get id() {
    return this._id
  }

  get json() {
    return this._json
  }

  async create(attrs = {}) {
    let json = structuredClone(this._json)
    const json_data = merge(attrs, json)
    this._json = json_data

    const result = await jsonQuery(
      '/accounts',
      {
        method: 'post',
        body: { ...attrs, ...json },
      },
      this._agent
    )

    this._id = result.id

    return result
  }

  async read() {
    return jsonQuery(`/accounts/${this._id}`, {}, this._agent)
  }

  async delete() {
    return query(`/accounts/${this._id}`, { method: 'delete' }, this._agent)
  }
}
