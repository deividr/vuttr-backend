import { createConnection, getConnection, getRepository } from 'typeorm'
import { User } from '../../infra/database/typeorm/entities/User'
import app from '../config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('should return 200 on signup', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'deivid',
        email: 'deivid@gmail.com.br',
        password: 'p@$$word',
        confirmPassword: 'p@$$word',
      })
      .expect(200)
      .then(async (response) => {
        await getRepository(User).delete(response.body.id)
      })
  })

  test('should return 400 if no one param is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'deivid',
        password: 'p@$$word',
        confirmPassword: 'p@$$word',
      })
      .expect(400)
  })
})
