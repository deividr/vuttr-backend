import { LogErrorRepository } from '$/data/protocols/db/log/log-error-repository'
import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '$/presentation/protocols/http'
import { LogDecorator } from './log-decorator'
import { ok, serverError } from '$/presentation/helpers/http/http-helpers'
import faker from 'faker'

interface SutTypes {
  sut: Controller
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: faker.name.findName(),
    email: faker.internet.email(),
  },
})

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok('Well done...'))
    }
  }

  return new ControllerStub()
}

const makeLogErroRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {}
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErroRepository()
  const sut = new LogDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  }
}

describe('Logs Decorator', () => {
  test('should call handle method with HttpRequest', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should call LogErrorRepository with correct values if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const response = serverError(new Error('Server error as encoutered'))
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(response)
    await sut.handle(mockRequest())
    expect(logErrorSpy).toHaveBeenCalledWith(response.body.stack)
  })

  test('shuold return same response of the controller', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(ok('Well done...'))
  })
})
