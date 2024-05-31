/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['/__tests__/feature/models/'],
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^schemas/(.*)$': '<rootDir>/src/schemas/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
  },
}
