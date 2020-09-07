import { CreateToolRepository } from '$/data/protocols/db/tool/create-tool-repository'
import { LoadToolByTitleRepository } from '$/data/protocols/db/tool/load-tool-by-title-repository'
import { ToolModel } from '$/domain/models/tool'
import {
  CreateTool,
  CreateToolParam,
} from '$/domain/usercases/tool/create-tool'

export class DbCreateTool implements CreateTool {
  constructor(
    private readonly createToolRepository: CreateToolRepository,
    private readonly loadToolByTitleRepository: LoadToolByTitleRepository,
  ) {}

  async create(param: CreateToolParam): Promise<ToolModel | null> {
    const toolModel = await this.loadToolByTitleRepository.loadByTitle(
      param.title,
    )

    if (!toolModel) {
      return await this.createToolRepository.create(param)
    }

    return null
  }
}
