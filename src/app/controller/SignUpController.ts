import Controller from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import * as Yup from 'yup'

export default class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      passwordConfirmation: Yup.string().required(),
    })

    return await schema
      .validate(httpRequest.body, { abortEarly: false })
      .then((obj) => {
        return { statusCode: 200, body: obj }
      })
      .catch(
        (error: Yup.ValidationError): HttpResponse => {
          const messagesError = error.inner.map((error) => error.message)

          return {
            statusCode: 400,
            body: { messages: messagesError },
          }
        },
      )
  }
}
