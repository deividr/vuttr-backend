import { SigninController } from '$/presentation/controller/signin/signin-controller'
import { Controller } from '$/presentation/protocols/controller'
import { LoginBodyRequestValidation } from '$/validation/validators/login/login-body-request-validation'
import { makeDbAuthentication } from '$/main/factories/usercases/user/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '$/main/factories/decorators/log-decorator-factory'

export const makeLoginController = (): Controller => {
  const validation = new LoginBodyRequestValidation()
  const controller = new SigninController(validation, makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
