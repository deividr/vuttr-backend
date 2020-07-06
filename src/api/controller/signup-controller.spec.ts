import SignUpController from './signup-controller'
import { CreateUser } from 'domain/usercases/user/create-user'
import { UserModel } from 'domain/models/user'

const makeUser = (): CreateUser => {
  class CreateUserStub implements CreateUser {
    async create(): Promise<UserModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
      }
    }
  }

  return new CreateUserStub()
}

const makeSignUpController = (): SignUpController => {
  const createUserStub = makeUser()

  return new SignUpController(createUserStub)
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com.br',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body.messages[0]).toEqual('name is a required field')
  })

  test('Should return 400 if no email is provided', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual('email is a required field')
  })

  test('Should return 400 if no password is provided', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        confirmPassword: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual(
      'password is a required field',
    )
  })

  test('Should return 400 if no confirmPassword is provided', async () => {
    const signUpController = makeSignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual(
      'confirmPassword is a required field',
    )
  })

  test('Should return 400 if more than two params is not provided', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages).toEqual([
      'email is a required field',
      'confirmPassword is a required field',
    ])
  })

  test('Should return 400 if email is invalid format', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual('email must be a valid email')
  })

  test('Should return 400 if password and confirmPassword does not match', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_passwordConfirmation',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual(
      'password and confirmPassword does not match',
    )
  })

  test('Should return 200 if valid entry fields', async () => {
    const signUpController = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.id).toEqual('any_id')
    expect(httpResponse.body.name).toEqual('any_name')
    expect(httpResponse.body.email).toEqual('any_email@email.com')
    expect(httpResponse.body.password).toEqual('any_password')
  })
})
