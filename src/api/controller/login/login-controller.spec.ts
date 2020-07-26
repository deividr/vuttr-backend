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
import faker from 'faker'
import { unauthorized } from '../../helpers/http/http-helpers'

interface SutTypes {
  sut: Controller
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthenticationStub()
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

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(
      authenticationParams: AuthenticationParams,
    ): Promise<AuthenticationModel | null> {
      return null
    }
  }

  return new AuthenticationStub()
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
})
