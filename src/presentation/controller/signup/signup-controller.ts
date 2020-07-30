import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { CreateUser } from '../../../domain/usercases/user/create-user'
import {
  badRequest,
  created,
  serverError,
} from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validation'
import { EmailAlreadyExistError } from '../../errors/email-already-exist-error'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { Authentication } from '../../../domain/usercases/user/authentication'

export class SignUpController implements Controller {
  constructor(
    private readonly createUser: CreateUser,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const { name, email, password } = httpRequest.body

      const body = await this.createUser.create({ name, email, password })

      if (!body) {
        return badRequest(new EmailAlreadyExistError())
      }

      const authModel = await this.authentication.auth({
        email: email,
        password: password,
      })

      return created(authModel)
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
