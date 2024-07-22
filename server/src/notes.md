# Notes

## Queries

```typescript
const { pagination, data } = await db('companies')
  .leftJoin('payment_methods', 'payment_methods.entity_id', 'companies.id')
  .where({ entity_type: 'company' })
  .where(builder => {
    if (name) builder.whereILike('companies.name', `%${name}%`)
    if (external_id) builder.whereILike('external_id', `%${external_id}%`)
  })
  .select([
    'companies.*',
    db.raw('json_agg(payment_methods.*) as payment_methods'),
  ])
  .groupBy('companies.id')
  .paginate({ perPage: page_size || 50, currentPage: page || 1 })

const existing_payment_methods = await db('payment_methods')
  .where({
    entity_id: req.params.id,
    entity_type: 'company',
  })
  .select(['name', 'account_number'])

const company = await db('companies').where('id', req.params.id).first()

await db('companies')
  .where({ id: req.params.id })
  .update({ updated_at: new Date(), ...flatten(updates, {}, '', '_') })
  .returning('id')

export const Search = z.object({ params: QueryParams })
export type SearchRequest = Request<
  z.infer<typeof Search>['params'],
  unknown,
  unknown,
  Pagination
>
export type SearchResponse = Response<PaginationResult<z.infer<typeof Account>>>

await db('settings')
  .insert(entries)
  .onConflict(['active_from', 'entity_id', 'entity_type', 'key'])
  .merge()
```

## Webhook

```typescript
test(`POST /pays`, async () => {
  // Bulk pays to run
  const pays: any = [
    {
      company_id: test_comp.id,
      type: 'standard',
      payment_method: 'ANZ',
      notification_uri: 'http://host.docker.internal:8081',
      frequency: 'weekly',
    },
  ]

  // Create a promise for each pay along with tracking the resolve function so the server can resolve the promise
  const promises: any = {}
  for (const pay of pays) {
    const pay_promise: any = {}
    const promise = new Promise(resolve => (pay_promise.resolve = resolve))
    pay_promise.promise = promise
    promises[pay.company_id] = pay_promise
  }

  // Listen for webhook requests
  const server = http.createServer()
  server.on('request', (req, res) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      const pay = JSON.parse(body)
      if (promises[pay.company_id]) promises[pay.company_id].resolve(pay)
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Ok\n')
    })
  })
  server.listen(8081)

  // Post webhooks and wait for promises to resolve
  const response = await query('/pays', {
    method: 'POST',
    body: JSON.stringify(pays),
  })
  expect(response.status).toBe(200)

  const results = await Promise.all(
    Object.values(promises).map((p: any) => p.promise)
  )
  server.close()

  for (const pay of pays) {
    const result = results.find((r: any) => r.company_id == pay.company_id)

    expect(result).toBeTruthy()
    expect(result.type).toBe(pay.type)
    expect(result.frequency).toBe(pay.pay_frequency)
  }
})
```
