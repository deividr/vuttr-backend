import Controller from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import * as Yup from 'yup'
import { CreateUser } from 'domain/usercases/user/create-user'
import { badRequest, ok } from '../helpers/http/http-helpers'

export default class SignUpController implements Controller {
  private readonly createUser: CreateUser

  constructor(user: CreateUser) {
    this.createUser = user
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string()
        .required()
        .when('password', (password: string, schema: Yup.StringSchema) =>
          schema.oneOf(
            [Yup.ref('password')],
            'password and confirmPassword does not match',
          ),
        ),
    })

    return await schema
      .validate(httpRequest.body, { abortEarly: false })
      .then(async (obj) => {
        const { name, email, password } = httpRequest.body

        const body = await this.createUser.create({ name, email, password })

        return ok(body)
      })
      .catch(
        (error: Yup.ValidationError): HttpResponse => {
          const messagesError = error.inner.map((error) => error.message)

          return badRequest({ messages: messagesError })
        },
      )
  }
}
