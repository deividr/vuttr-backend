import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { LogDecorator } from './log-decorator'

interface SutTypes {
  sut: Controller
  controllerStub: Controller
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve({ statusCode: 200, body: {} })
    }
  }

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()

  const sut = new LogDecorator(controllerStub)

  return {
    sut,
    controllerStub,
  }
}

describe('Logs Decorator', () => {
  test('should call handle method with HttpRequest', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'Joao Marinho',
        email: 'joaomarinho@email.com.br',
      },
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
