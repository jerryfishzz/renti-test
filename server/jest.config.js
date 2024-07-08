/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '/__tests__/integration/models/',
    '/__tests__/integration/services/',
    '/__tests__/integration/utils.ts',
  ],
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^schemas/(.*)$': '<rootDir>/src/schemas/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}
