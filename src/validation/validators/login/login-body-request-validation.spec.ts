import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'
import { LoginBodyRequestValidation } from './login-body-request-validation'
import faker from 'faker'

describe('Login body request validation', () => {
  test('should return InvalidParamError if any param are not provided', async () => {
    const sut = new LoginBodyRequestValidation()
    const validate = (): void => {
      sut.validate({ email: faker.internet.email() })
    }
    expect(validate).toThrowError(InvalidParamError)
  })
})
