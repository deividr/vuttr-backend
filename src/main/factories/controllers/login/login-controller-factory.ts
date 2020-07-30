import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LoginBodyRequestValidation } from '../../../../validation/validators/login/login-body-request-validation'
import { makeDbAuthentication } from '../../usercases/user/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-decorator-factory'

export default (): Controller => {
  const validation = new LoginBodyRequestValidation()
  const controller = new LoginController(validation, makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
