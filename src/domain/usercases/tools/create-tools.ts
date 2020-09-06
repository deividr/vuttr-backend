import { ToolsModel } from '$/domain/models/tools'

export type CreateToolsParam = Omit<ToolsModel, 'id'>

export interface CreateTools {
  create: (param: CreateToolsParam) => Promise<ToolsModel>
}
