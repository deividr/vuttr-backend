import { Validation } from '$/presentation/protocols/validation'
import { InvalidParamError } from '$/presentation/errors/invalid-param-error'
import * as Yup from 'yup'

export class SigninBodyRequestValidation implements Validation {
  validate(body: any): void {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    try {
      schema.validateSync(body)
    } catch (error) {
      throw new InvalidParamError((error as Yup.ValidationError).message)
    }
  }
}
