import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  testRegex: 'src/__tests__/.*spec\\.tsx?$',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
}

export default createJestConfig(customJestConfig)
