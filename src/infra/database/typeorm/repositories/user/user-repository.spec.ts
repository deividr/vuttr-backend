import { UserRepository } from './user-repository'
import { createConnection, getConnection, getRepository } from 'typeorm'
import { User } from '../../entities/User'
import faker from 'faker'

describe('User Repository Data Base', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('should return an UserModel when UserRepository return success', async () => {
    const userRepository = new UserRepository()

    const createUserParams = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const user = await userRepository.create(createUserParams)

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe(createUserParams.name)
    expect(user.email).toBe(createUserParams.email)
    expect(user.password).toBe(createUserParams.password)

    await getRepository(User).delete(user.id)
  })
})
