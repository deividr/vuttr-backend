import Controller from '../../protocols/controller'
import LoginController from './login-controller'

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
        password: 'joao_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
