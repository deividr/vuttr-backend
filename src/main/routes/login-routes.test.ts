import { createConnection, getConnection, getRepository } from 'typeorm'
import { User } from '../../infra/database/typeorm/entities/User'
import { hash } from 'bcrypt'
import faker from 'faker'

describe('Login Router', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('should return 200 if credential success', async () => {
    const password = await hash('123', 12)

    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
    }

    await getRepository(User).create(user).save()
  })
})
