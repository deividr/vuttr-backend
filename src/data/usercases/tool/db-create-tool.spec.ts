import { CreateToolRepository } from '$/data/protocols/db/tool/create-tool-repository'
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

const makeSut = (): SutTypes => {
  const createToolRepositoryStub = makeCreateToolRepositoryStub()
  const sut = new DbCreateTool(createToolRepositoryStub)

  return {
    sut,
    createToolRepositoryStub,
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
})
