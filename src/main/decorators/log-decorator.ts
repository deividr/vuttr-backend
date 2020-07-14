import Controller from '../../api/protocols/controller'
import { HttpRequest, HttpResponse } from '../../api/protocols/http'

class LogDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    return httpResponse
  }
}

export default LogDecorator
