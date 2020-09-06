import { CreateTools } from '$/domain/usercases/tools/create-tools'
import { badRequest, ok } from '$/presentation/helpers/http/http-helpers'
import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '$/presentation/protocols/http'
import { Validation } from '$/presentation/protocols/validation'

export class CreateToolsController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createTools: CreateTools,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      const toolsModel = await this.createTools.create(httpRequest.body)
      return ok(toolsModel)
    } catch (error) {
      return badRequest(error)
    }
  }
}
