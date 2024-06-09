import { z } from 'zod'
import type { Request, Response } from 'express'

import { Genre } from 'types/db'

export type ResponseGenre = Response<Genre>
