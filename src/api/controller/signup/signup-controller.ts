import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { CreateUser } from '../../../domain/usercases/user/create-user'
import { badRequest, ok } from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor(
    private readonly createUser: CreateUser,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const { name, email, password } = httpRequest.body

      const body = await this.createUser.create({ name, email, password })

      return ok(body)
    } catch (error) {
      return badRequest(error)
    }
  }
}
