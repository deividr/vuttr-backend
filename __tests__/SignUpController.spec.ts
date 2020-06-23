import SignUpController from '../src/app/controller/SignUpController'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const signUpController = new SignUpController()

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
    const signUpController = new SignUpController()

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
    const signUpController = new SignUpController()

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
      'confirmPassword is a required field',
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
      'confirmPassword is a required field',
    ])
  })

  test('Should return 400 if email is invalid format', async () => {
    const signUpController = new SignUpController()

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
    const signUpController = new SignUpController()

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
    const signUpController = new SignUpController()

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
    expect(httpResponse.body.name).toEqual('any_name')
    expect(httpResponse.body.email).toEqual('any_email@email.com')
    expect(httpResponse.body.password).toEqual('any_password')
    expect(httpResponse.body.confirmPassword).toEqual('any_password')
  })
})
