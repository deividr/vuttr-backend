import { SigninController } from '$/presentation/controller/login/signin/signin-controller'
import { Controller } from '$/presentation/protocols/controller'
import { SigninBodyRequestValidation } from '$/validation/validators/login/signin-body-request-validation'
import { makeDbAuthentication } from '$/main/factories/usercases/user/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '$/main/factories/decorators/log-decorator-factory'

export const makeSigninController = (): Controller => {
  const validation = new SigninBodyRequestValidation()
  const controller = new SigninController(validation, makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
