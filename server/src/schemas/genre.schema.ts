import type { Response } from 'express'

import { Genre } from 'types/db'

export type ResponseGenre = Response<Genre>

export type GetGenresResponse = Response<Genre[]>
