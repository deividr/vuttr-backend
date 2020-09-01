import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '$/presentation/protocols/http'
import { Validation } from '$/presentation/protocols/validation'

export class CreateToolsController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)

    return await Promise.resolve({ statusCode: 200, body: null })
  }
}
