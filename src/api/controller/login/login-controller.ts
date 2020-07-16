import { HttpRequest, HttpResponse } from '../../protocols/http'
import Controller from '../../protocols/controller'
import InvalidParamError from '../../errors/invalid-param-error'
import { badRequest, ok } from '../../helpers/http/http-helpers'

class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new InvalidParamError('Email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new InvalidParamError('Password'))
    }

    return ok({ body: '' })
  }
}

export default LoginController
