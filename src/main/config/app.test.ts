import request from 'supertest'
import app from './app'

describe('Application Express', () => {
  test('Should body parser as json correct', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ firstName: 'Body', lastName: 'Parser' })
      .expect(200)
      .expect({ firstName: 'Body', lastName: 'Parser' })
  })

  test('Should midleware CORS enabel for routes', async () => {
    app.post('test_enable_cors', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-enable-cors')
      .expect('access-control-allow-origin', '*')
  })

  test('Should x-powered-by has disable', async () => {
    app.get('/test-xpoweredby-disable', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-xpoweredby-disable')
      .expect((res) => {
        if ('x-powered-by' in res.header) {
          throw new Error('x-powered-by is present in header')
        }
      })
  })
})
