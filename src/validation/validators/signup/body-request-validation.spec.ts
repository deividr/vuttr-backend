import { Validation } from '../../../api/protocols/validation'
import { SignupBodyRequestValidation } from './body-request-validation'
import { InvalidParamError } from '../../../api/errors/invalid-param-error'
import faker from 'faker'

interface SutTypes {
  sut: Validation
}

const makeSut = (): SutTypes => {
  const sut = new SignupBodyRequestValidation()
  return { sut }
}

const makeBody = (): any => {
  const password = faker.internet.password()

  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password,
    confirmPassword: password,
  }
}

describe('Signup Body Request Validations', () => {
  test('should return throw MissingErrorParam when a field is not provided', () => {
    const { sut } = makeSut()

    const { email, password, confirmPassword } = makeBody()

    const validate = (): void => {
      sut.validate({ email, password, confirmPassword })
    }

    expect(validate).toThrowError(InvalidParamError)
  })

  test('should not return when validation success', () => {
    const { sut } = makeSut()

    const result = sut.validate(makeBody())

    expect(result).toBeFalsy()
  })
})
