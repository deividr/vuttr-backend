import { SignUpController } from '$/presentation/controller/login/signup/signup-controller'
import { Controller } from '$/presentation/protocols/controller'
import { SignupBodyRequestValidation } from '$/validation/validators/login/signup/body-request-validation'
import { makeLogControllerDecorator } from '$/main/factories/decorators/log-decorator-factory'
import { makeDbAuthentication } from '$/main/factories/usercases/user/authentication/db-authentication-factory'
import { makeDbCreateUser } from '$/main/factories/usercases/user/create-user/db-create-user-factory'

export const makeSignupController = (): Controller => {
  const validation = new SignupBodyRequestValidation()
  const controller = new SignUpController(
    makeDbCreateUser(),
    validation,
    makeDbAuthentication(),
  )
  return makeLogControllerDecorator(controller)
}
