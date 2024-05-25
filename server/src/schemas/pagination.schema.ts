import { z } from 'zod'

export const pagination = z.object({
  page: z.number().optional(),
  page_size: z.number().optional(),
})
export type Pagination = z.infer<typeof pagination>

export type PaginationResult<T> = {
  page: number
  page_size: number
  results: T[]
}
