import { Controller } from '../../protocols/controller'
import LoginController from './login-controller'
import { HttpRequest } from '../../protocols/http'
import faker from 'faker'
import { Validation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors/invalid-param-error'

interface SutTypes {
  sut: Controller
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub)
  return {
    sut,
    validationStub,
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(body: any): void {}
  }

  return new ValidationStub()
}

const mockRequest = (): HttpRequest => {
  return {
    body: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  }
}

describe('Login Controller', () => {
  test('should call validate method with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if any parameters are not provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new InvalidParamError('')
    })
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(400)
  })
})
