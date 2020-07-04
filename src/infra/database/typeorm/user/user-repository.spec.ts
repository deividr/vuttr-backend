import { UserRepository } from './user-repository'
import { createConnection, getConnection } from 'typeorm'

describe('User Repository Data Base', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('should return an user when create on DB success', async () => {
    const userRepository = new UserRepository()

    const createUserParams = {
      name: 'valid_name',
      email: 'valid_value@email.com.br',
      password: 'valid_password',
    }

    const user = await userRepository.create(createUserParams)

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe('valid_name')
    expect(user.email).toBe('valid_value@email.com.br')
    expect(user.password).toBe('valid_password')
  })
})
