import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { CreateUser } from '../../../domain/usercases/user/create-user'
import { badRequest, created } from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validation'
import { EmailAlreadyExistError } from '../../errors/email-already-exist-error'

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

      if (body) {
        return created(body)
      } else {
        return badRequest(new EmailAlreadyExistError())
      }
    } catch (error) {
      return badRequest(error)
    }
  }
}
