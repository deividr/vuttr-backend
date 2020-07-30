import { SignUpController } from '../../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { SignupBodyRequestValidation } from '../../../../validation/validators/signup/body-request-validation'
import { makeLogControllerDecorator } from '../../decorators/log-decorator-factory'
import { makeDbAuthentication } from '../../usercases/user/authentication/db-authentication-factory'
import { makeDbCreateUser } from '../../usercases/user/create-user/db-create-user-factory'

export const makeSignupController = (): Controller => {
  const validation = new SignupBodyRequestValidation()
  const controller = new SignUpController(
    makeDbCreateUser(),
    validation,
    makeDbAuthentication(),
  )
  return makeLogControllerDecorator(controller)
}
