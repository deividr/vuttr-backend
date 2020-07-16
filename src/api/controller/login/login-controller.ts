import { HttpRequest, HttpResponse } from '../../protocols/http'
import Controller from '../../protocols/controller'
import MissingParamError from '../../errors/missing-param'
import { badRequest, ok } from '../../helpers/http/http-helpers'

class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('Email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('Password'))
    }

    return ok({ body: '' })
  }
}

export default LoginController
