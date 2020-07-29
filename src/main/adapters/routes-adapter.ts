import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols/controller'

export default (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const { body } = request

    const responseController = await controller.handle({ body })

    if (
      responseController.statusCode >= 200 &&
      responseController.statusCode <= 299
    ) {
      response
        .status(responseController.statusCode)
        .json(responseController.body)
    } else {
      response
        .status(responseController.statusCode)
        .json({ error: responseController.body.message })
    }
  }
}
