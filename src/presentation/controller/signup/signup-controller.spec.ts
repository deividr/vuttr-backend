import { SignUpController } from './signup-controller'
import {
  CreateUser,
  CreateUserParams,
} from '../../../domain/usercases/user/create-user'
import { UserModel } from '../../../domain/models/user'
import { Validation } from '../../protocols/validation'
import { Controller } from '../../protocols/controller'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { EmailAlreadyExistError } from '../../errors/email-already-exist-error'
import { HttpRequest } from '../../protocols/http'
import {
  badRequest,
  created,
  serverError,
} from '../../helpers/http/http-helpers'
import {
  Authentication,
  AuthenticationParams,
} from '../../../domain/usercases/user/authentication'
import { AuthenticationModel } from '../../../domain/models/authentication'
import faker from 'faker'

interface SutTypes {
  sut: Controller
  createUserStub: CreateUser
  validationStub: Validation
  authenticationStub: Authentication
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()

  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      confirmPassword: password,
    },
  }
}

const makeCreateUser = (): CreateUser => {
  class CreateUserStub implements CreateUser {
    async create(createUserParams: CreateUserParams): Promise<UserModel> {
      return {
        id: faker.random.uuid(),
        name: createUserParams.name,
        email: createUserParams.email,
        password: createUserParams.password,
      }
    }
  }

  return new CreateUserStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(body: any): void {}
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(
      authenticationParams: AuthenticationParams,
    ): Promise<AuthenticationModel | null> {
      return null
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const createUserStub = makeCreateUser()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(
    createUserStub,
    validationStub,
    authenticationStub,
  )

  return {
    sut,
    createUserStub,
    validationStub,
    authenticationStub,
  }
}

describe('SignUp Controller', () => {
  test('should call Validation method with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()

    const { email, password, confirmPassword } = mockRequest().body

    const httpRequest = {
      body: { email, password, confirmPassword },
    }

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new InvalidParamError('name is missing')
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('name is missing')),
    )
  })

  test('should call CreateUser method with correct values', async () => {
    const { sut, createUserStub } = makeSut()
    const createSpy = jest.spyOn(createUserStub, 'create')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const { name, email, password } = httpRequest.body
    expect(createSpy).toHaveBeenCalledWith({ name, email, password })
  })

  test('should return 400 if email provided already used', async () => {
    const { sut, createUserStub } = makeSut()
    jest
      .spyOn(createUserStub, 'create')
      .mockResolvedValueOnce(Promise.resolve(null))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(badRequest(new EmailAlreadyExistError()))
  })

  test('should return 500 if CreateUser throws', async () => {
    const { sut, createUserStub } = makeSut()
    jest.spyOn(createUserStub, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should call Authentication method with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith({
      email: request.body.email,
      password: request.body.password,
    })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid entry fields', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(httpResponse.body))
  })
})
