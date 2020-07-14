import { createConnection, getConnection, getRepository } from 'typeorm'
import request from 'supertest'
import app from '../config/app'
import { User } from '../../infra/database/typeorm/entities/User'

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
})
