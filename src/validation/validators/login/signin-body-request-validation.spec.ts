import { InvalidParamError } from '$/presentation/errors/invalid-param-error'
import { SigninBodyRequestValidation } from './signin-body-request-validation'
import faker from 'faker'

describe('Signin body request validation', () => {
  test('should return InvalidParamError if any param are not provided', async () => {
    const sut = new SigninBodyRequestValidation()
    const validate = (): void => {
      sut.validate({ email: faker.internet.email() })
    }
    expect(validate).toThrowError(InvalidParamError)
  })
})
