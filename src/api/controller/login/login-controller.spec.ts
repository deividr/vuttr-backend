import Controller from '../../protocols/controller'
import LoginController from './login-controller'
import faker from 'faker'

interface SutTypes {
  sut: Controller
}

const makeLoginController = (): SutTypes => {
  const sut = new LoginController()
  return {
    sut,
  }
}

describe('Login Controller', () => {
  test('should return 400 if no e-mail is provided', async () => {
    const { sut } = makeLoginController()

    const httpRequest = {
      body: {
        password: faker.internet.password(),
      },
    }

    console.log(httpRequest.body.password)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
