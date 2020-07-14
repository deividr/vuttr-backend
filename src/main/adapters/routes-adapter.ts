import { Request, Response } from 'express'
import Controller from '../../api/protocols/controller'

export default (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const { body } = request

    const responseController = await controller.handle({ body })

    response.status(responseController.statusCode).json(responseController.body)
  }
}
