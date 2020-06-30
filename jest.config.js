module.exports = {
  roots: ['__tests__', 'src/app'],
  collectCoverageFrom: ['src/app/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
}
