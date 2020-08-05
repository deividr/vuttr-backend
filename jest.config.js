module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/*'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/infra/database/typeorm/migrations',
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\$/(.*)': '<rootDir>/src/$1',
  },
}
