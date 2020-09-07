import { CreateToolRepository } from '$/data/protocols/db/tool/create-tool-repository'
import { ToolModel } from '$/domain/models/tool'
import {
  CreateTool,
  CreateToolParam,
} from '$/domain/usercases/tool/create-tool'

export class DbCreateTool implements CreateTool {
  constructor(private readonly createToolRepository: CreateToolRepository) {}

  async create(param: CreateToolParam): Promise<ToolModel> {
    return await this.createToolRepository.create(param)
  }
}
