import { createConnection, getConnection } from 'typeorm'
import app from '../config/app'
import request from 'supertest'
import faker from 'faker'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

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

  test('should return 400 if no one param is provided', async () => {
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
