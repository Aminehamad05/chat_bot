import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!db/migrations/**',
    '!db/migrate.ts',
    '!index.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
    },
  },
}

export default config