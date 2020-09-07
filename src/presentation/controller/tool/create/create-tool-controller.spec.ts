import { InvalidParamError } from '$/presentation/errors/invalid-param-error'
import { badRequest, ok } from '$/presentation/helpers/http/http-helpers'
import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest } from '$/presentation/protocols/http'
import { Validation } from '$/presentation/protocols/validation'
import { CreateToolController } from './create-tool-controller'
import {
  CreateTool,
  CreateToolParam,
} from '$/domain/usercases/tool/create-tool'
import { ToolModel } from '$/domain/models/tool'

import faker from 'faker'

interface SutTypes {
  sut: Controller
  validationStub: Validation
  createToolStub: CreateToolStub
}

const mockHttpRequest = (): HttpRequest => {
  return {
    body: {
      title: 'Notion',
      link: 'https://notion.so',
      description:
        'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ',
      tags: [
        'organization',
        'planning',
        'collaboration',
        'writing',
        'calendar',
      ],
    },
  }
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(body: any): void {}
  }

  return new ValidationStub()
}
class CreateToolStub implements CreateTool {
  toolsModel: ToolModel

  async create(param: CreateToolParam): Promise<ToolModel> {
    this.toolsModel = {
      id: faker.random.uuid(),
      ...param,
    }

    return this.toolsModel
  }
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const createToolsStub = new CreateToolStub()
  const sut = new CreateToolController(validationStub, createToolsStub)

  return {
    sut,
    validationStub,
    createToolStub: createToolsStub,
  }
}

describe('CreateTools Controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new InvalidParamError('link is missing')

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw error
    })

    const httpRequest = mockHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(error))
  })

  test('should call CreateTools method with correct values', async () => {
    const { sut, createToolStub: createToolsStub } = makeSut()
    const createSpy = jest.spyOn(createToolsStub, 'create')
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(createSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 200 if valid params are provided ', async () => {
    const { sut, createToolStub: createToolsStub } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(createToolsStub.toolsModel))
  })
})
