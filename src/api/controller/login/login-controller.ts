import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../../protocols/controller'
import { badRequest, created } from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validation'

class LoginController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      return created({ body: '' })
    } catch (error) {
      return badRequest(error)
    }
  }
}

export default LoginController
