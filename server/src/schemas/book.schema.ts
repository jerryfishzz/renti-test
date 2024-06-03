import type { Response } from 'express'

import { Book } from 'types/db'

export type GetBooksResponse = Response<(Book & { genre: string })[]>
