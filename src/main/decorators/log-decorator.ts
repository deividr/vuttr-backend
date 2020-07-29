import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'

export class LogDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode >= 500) {
      const error = httpResponse.body as Error
      await this.logErrorRepository.logError(error.stack as string)
    }
    return httpResponse
  }
}
