import { CreateUser } from '../../domain/usercases/user/create-user'
import { User } from '../../domain/models/user'

class CreateUserRepositoryStub implements CreateUser {
  async create(user: User): Promise<User> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }
  }
}

describe('Database Create User Case', () => {
  test('Should return ok when Encrypter call with correct password', async () => {
    const createUserRepository = new CreateUserRepositoryStub()

    const user = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const userReturn = await createUserRepository.create(user)

    return userReturn
  })
})
