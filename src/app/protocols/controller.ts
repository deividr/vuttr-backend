import { HttpRequest, HttpResponse } from '../protocols/http'

export default interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
