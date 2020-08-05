import { HttpRequest, HttpResponse } from '$/presentation/protocols/http'
import { Controller } from '$/presentation/protocols/controller'
import {
  ok,
  unauthorized,
  badRequest,
  serverError,
} from '$/presentation/helpers/http/http-helpers'
import { Validation } from '$/presentation/protocols/validation'
import { Authentication } from '$/presentation/../domain/usercases/user/authentication'
import { InvalidParamError } from '$/presentation/errors/invalid-param-error'

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const authModel = await this.authentication.auth(httpRequest.body)

      if (authModel) {
        return ok(authModel)
      } else {
        return unauthorized()
      }
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
