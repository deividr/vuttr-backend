import { getConnection, createConnection } from 'typeorm'
import { LogRepository } from './log-repository'

describe('Log Repository', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('should create an error log on success', async () => {
    const logRepository = new LogRepository()
    const promise = logRepository.logError('Server error...')
    await expect(promise).resolves.not.toThrow()
  })
})
