import SignUpController from '../src/app/controller/SignUpController'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const signUpController = new SignUpController()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body.messages[0]).toEqual('name is a required field')
  })

  test('Should return 400 if no email is provided', async () => {
    const signUpController = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual('email is a required field')
  })

  test('Should return 400 if no password is provided', async () => {
    const signUpController = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual(
      'password is a required field',
    )
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const signUpController = new SignUpController()

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
      'passwordConfirmation is a required field',
    )
  })

  test('Should return 400 if more than two params is not provided', async () => {
    const signUpController = new SignUpController()

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
      'passwordConfirmation is a required field',
    ])
  })

  test('Should return 400 if email is invalid format', async () => {
    const signUpController = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.messages[0]).toEqual('email must be a valid email')
  })
})
