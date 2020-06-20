module.exports = {
  roots: ['__tests__', 'src/app'],
  collectCoverage: true,
  collectCoverageFrom: ['src/app/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
}
