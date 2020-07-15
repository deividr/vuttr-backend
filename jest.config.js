module.exports = {
  roots: ['src'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/infra/database/typeorm/migrations',
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
}
