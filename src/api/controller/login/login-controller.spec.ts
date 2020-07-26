import { Controller } from '../../protocols/controller'
import { LoginController } from './login-controller'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors/invalid-param-error'
import {
  Authentication,
  AuthenticationParams,
} from '../../../domain/usercases/user/authentication'
import { AuthenticationModel } from '../../../domain/models/authentication'
import { unauthorized, ok } from '../../helpers/http/http-helpers'
import faker from 'faker'

interface SutTypes {
  sut: Controller
  validationStub: Validation
  authenticationStub: AuthenticationStub
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub,
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(body: any): void {}
  }

  return new ValidationStub()
}

class AuthenticationStub implements Authentication {
  authModel: AuthenticationModel

  async auth(
    authenticationParams: AuthenticationParams,
  ): Promise<AuthenticationModel | null> {
    this.authModel = { accessToken: 'any_token', name: 'any_name' }
    return this.authModel
  }
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

  test('should call Authentication method', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body)
  })

  test('should return 401 invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(ok(authenticationStub.authModel))
  })
})
