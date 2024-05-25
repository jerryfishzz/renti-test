import { faker } from '@faker-js/faker'

import { query, jsonQuery, merge } from './util.js'

export default class Account {
  private _id: any
  // private _settings: any
  private _json: any
  // employments: any[]

  constructor(json: any = null) {
    this._id = null
    // this._settings = null
    // this.employments = []

    if (json) {
      this._id = json.id
      this._json = structuredClone(json)
      delete this._json.id
      // this._settings = new CompanySettings(json.id, json.settings)
    } else {
      // this._settings = new CompanySettings()
      this._json = {
        name: faker.company.name(),
        external_id: faker.database.mongodbObjectId(),
        first_period_start_date: '2024-01-15',
        ird_number: '00-000-000',
        contact: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: {
            line1: faker.location.streetAddress(),
            line2: faker.location.county(),
            city: faker.location.city(),
            region: 'Auckland',
            country: 'New Zealand',
          },
        },
        communication: {
          notification_email: faker.internet.email(),
          notification_types: ['disbursement_sent'],
        },
        payment_methods: [
          { name: 'ANZ', account_number: '00-0000-0000000-000' },
        ],
        // settings: structuredClone(this._settings.json),
      }
    }
  }

  get id() {
    return this._id
  }

  get json() {
    return this._json
  }

  // get settings() {
  //   return this._settings
  // }

  async create(attrs = {}) {
    let json = structuredClone(this._json)
    const json_data = merge(attrs, json)
    this._json = json_data

    const result = await jsonQuery('/companies', {
      method: 'post',
      body: JSON.stringify({ ...attrs, ...json }),
    })

    this._id = result.id
    // this._settings.company_id = result.id

    return result
  }

  async read() {
    return jsonQuery(`/companies/${this._id}`)
  }

  async update(change: any) {
    merge(change, this._json)
    const req = await query(`/companies/${this._id}`, {
      method: 'PATCH',
      body: JSON.stringify(change),
    })
    return req
  }

  async delete() {
    return query(`/companies/${this._id}`, { method: 'delete' })
  }
}
