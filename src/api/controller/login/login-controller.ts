import { HttpRequest, HttpResponse } from '../../protocols/http'
import Controller from '../../protocols/controller'
import MissingParamError from '../../errors/missing-param'

class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await Promise.resolve({
        statusCode: 400,
        body: new MissingParamError('Email'),
      })
    }
    return await Promise.resolve({ statusCode: 200, body: {} })
  }
}

export default LoginController
