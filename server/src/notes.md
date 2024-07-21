# Notes

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
