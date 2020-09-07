import { ToolModel } from '$/domain/models/tool'

export interface LoadToolByTitleRepository {
  loadByTitle: (title: string) => Promise<ToolModel | null>
}
