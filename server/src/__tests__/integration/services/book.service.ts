import { faker } from '@faker-js/faker'

import { CreateBook, GetBooksByAccountIdReturn } from 'schemas/book.schema'
import { query, Response } from '../utils'

export function getCreateMockBooks(min: number, max: number) {
  return (counts: number = 1) => {
    const books: CreateBook[] = []
    for (let i = 0; i < counts; i++) {
      const book: CreateBook = {
        title: faker.lorem.words({ min: 1, max: 4 }),
        author: faker.person.fullName(),
        genre_id: faker.number.int({ min, max }),
        cover_image: faker.image.url(),
      }
      books.push(book)
    }
    return books
  }
}

export function getByAccountId(
  id: number
): Promise<Response<GetBooksByAccountIdReturn[]>> {
  return query({ path: `/books/account/${id}` })
}
