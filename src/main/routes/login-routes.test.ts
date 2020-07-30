import { createConnection, getConnection, getRepository } from 'typeorm'
import { User } from '../../infra/database/typeorm/entities/User'
import { hash } from 'bcrypt'
import app from '../config/app'
import faker from 'faker'
import request from 'supertest'

describe('Login Routes', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('POST /login', () => {
    test('should return 200 if credential success', async () => {
      const password = await hash('123', 12)

      const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password,
      }

      await getRepository(User).create(user).save()

      await request(app)
        .post('/api/login')
        .send({
          email: user.email,
          password: '123',
        })
        .expect(200)
    })

    test('should return 400 if no one param are provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: faker.internet.email(),
        })
        .expect(400)
    })
  })

  describe('POST /signup', () => {
    test('should return 201 on signup', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/signup')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password,
          confirmPassword: password,
        })
        .expect(201)
    })

    test('should return 400 if no one param are provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: faker.name.findName(),
          password: faker.internet.password(),
          confirmPassword: faker.internet.password(),
        })
        .expect(400)
    })
  })
})
