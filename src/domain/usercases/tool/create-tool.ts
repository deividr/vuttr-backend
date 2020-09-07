import { ToolModel } from '$/domain/models/tool'

export type CreateToolParam = Omit<ToolModel, 'id'>

export interface CreateTool {
  create: (param: CreateToolParam) => Promise<ToolModel>
}
