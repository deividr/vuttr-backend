import { CreateTool } from '$/domain/usercases/tool/create-tool'
import { InvalidParamError } from '$/presentation/errors/invalid-param-error'
import { ToolAlreadyExistError } from '$/presentation/errors/tool-already-exist-error'
import {
  badRequest,
  ok,
  serverError,
} from '$/presentation/helpers/http/http-helpers'
import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '$/presentation/protocols/http'
import { Validation } from '$/presentation/protocols/validation'

export class CreateToolController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createTools: CreateTool,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const toolModel = await this.createTools.create(httpRequest.body)

      if (toolModel) {
        return ok(toolModel)
      } else {
        return badRequest(new ToolAlreadyExistError())
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
