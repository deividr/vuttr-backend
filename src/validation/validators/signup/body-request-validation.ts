import { Validation } from '../../../api/protocols/validation'
import * as Yup from 'yup'
import { CreateUserParams } from '../../../domain/usercases/user/create-user'
import InvalidParamError from '../../../api/errors/invalid-param-error'

class SignupBodyRequestValidation implements Validation {
  validate(body: CreateUserParams): void {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string()
        .required()
        .when('password', (password: string, schema: Yup.StringSchema) =>
          schema.oneOf(
            [Yup.ref('password')],
            'password and confirmPassword does not match',
          ),
        ),
    })

    try {
      schema.validateSync(body)
    } catch (error) {
      throw new InvalidParamError((error as Yup.ValidationError).message)
    }
  }
}

export default SignupBodyRequestValidation
