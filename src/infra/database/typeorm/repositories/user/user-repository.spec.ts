import { UserRepository } from './user-repository'
import { createConnection, getConnection, getRepository } from 'typeorm'
import { User } from '$/infra/database/typeorm/entities/User'
import faker from 'faker'
import { CreateUserParams } from '$/domain/usercases/user/create-user'

const mockCreateUserParams = (): CreateUserParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

describe('User Repository Data Base', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('create()', () => {
    test('should return an UserModel when UserRepository return success', async () => {
      const userRepository = new UserRepository()

      const createUserParams = mockCreateUserParams()

      const user = await userRepository.create(createUserParams)

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(createUserParams.name)
      expect(user.email).toBe(createUserParams.email)
      expect(user.password).toBe(createUserParams.password)

      await getRepository(User).delete(user.id)
    })
  })

  describe('loadUserByEmail()', () => {
    test('should return null if loadUserByEmail fail', async () => {
      const userRepository = new UserRepository()
      const result = await userRepository.loadUserByEmail(
        faker.internet.email(),
      )
      expect(result).toBeNull()
    })

    test('should return User if email already exist', async () => {
      const userRepository = new UserRepository()
      const userParams = mockCreateUserParams()
      const user = await userRepository.create(userParams)
      const result = await userRepository.loadUserByEmail(userParams.email)
      expect(result?.id).toEqual(user.id)
    })
  })
})
