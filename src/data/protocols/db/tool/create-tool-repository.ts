import { ToolModel } from '$/domain/models/tool'
import { CreateToolParam } from '$/domain/usercases/tool/create-tool'

export interface CreateToolRepository {
  create: (param: CreateToolParam) => Promise<ToolModel>
}
