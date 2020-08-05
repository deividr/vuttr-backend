import { getRepository } from 'typeorm'
import { LogErrorRepository } from '$/data/protocols/db/log/log-error-repository'
import { Log } from '$/infra/database/typeorm/entities/Log'

export class LogRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const repository = getRepository(Log)
    await repository.create({ stack }).save()
  }
}
