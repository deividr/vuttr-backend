import { LogRepository } from '../../../infra/database/typeorm/repositories/log/log-repository'
import { Controller } from '../../../presentation/protocols/controller'
import { LogDecorator } from '../../decorators/log-decorator'

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  const logRepository = new LogRepository()
  return new LogDecorator(controller, logRepository)
}
