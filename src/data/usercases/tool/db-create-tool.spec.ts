import { CreateToolRepository } from '$/data/protocols/db/tool/create-tool-repository'
import { LoadToolByTitleRepository } from '$/data/protocols/db/tool/load-tool-by-title-repository'
import { ToolModel } from '$/domain/models/tool'
import {
  CreateTool,
  CreateToolParam,
} from '$/domain/usercases/tool/create-tool'
import faker from 'faker'
import { DbCreateTool } from './db-create-tool'

interface SutTypes {
  sut: CreateTool
  createToolRepositoryStub: CreateToolRepository
  loadToolByTitleRepositoryStub: LoadToolByTitleRepository
}

const mockToolParam = (): CreateToolParam => {
  return {
    title: 'Notion',
    link: 'https://notion.so',
    description:
      'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ',
    tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
  }
}

const makeCreateToolRepositoryStub = (): CreateToolRepository => {
  class CreateToolRepositoryStub implements CreateToolRepository {
    async create(param: CreateToolParam): Promise<ToolModel> {
      return await Promise.resolve({ id: faker.random.uuid(), ...param })
    }
  }

  return new CreateToolRepositoryStub()
}

const makeLoadToolByTitleRepositoryStub = (): LoadToolByTitleRepository => {
  class LoadToolByTitleRespositoryStub implements LoadToolByTitleRepository {
    async loadByTitle(title: string): Promise<ToolModel | null> {
      return await Promise.resolve(null)
    }
  }

  return new LoadToolByTitleRespositoryStub()
}

const makeSut = (): SutTypes => {
  const createToolRepositoryStub = makeCreateToolRepositoryStub()
  const loadToolByTitleRepositoryStub = makeLoadToolByTitleRepositoryStub()
  const sut = new DbCreateTool(
    createToolRepositoryStub,
    loadToolByTitleRepositoryStub,
  )

  return {
    sut,
    createToolRepositoryStub,
    loadToolByTitleRepositoryStub,
  }
}

describe('Database Create Tool Case', () => {
  test('should call CreateToolRepository with correct values', async () => {
    const { sut, createToolRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(createToolRepositoryStub, 'create')
    const toolParam = mockToolParam()
    await sut.create(toolParam)
    expect(createSpy).toHaveBeenCalledWith(toolParam)
  })

  test('should return null if tool already exist', async () => {
    const { sut, loadToolByTitleRepositoryStub } = makeSut()

    jest
      .spyOn(loadToolByTitleRepositoryStub, 'loadByTitle')
      .mockResolvedValueOnce({
        id: faker.random.uuid(),
        ...mockToolParam(),
      })

    const response = await sut.create(mockToolParam())
    expect(response).toBeNull()
  })

  test('should return ToolModel if create with success', async () => {
    const { sut } = makeSut()
    const toolModel = await sut.create(mockToolParam())
    expect(toolModel).toBeTruthy()
    expect(toolModel).toHaveProperty('id')
  })
})
