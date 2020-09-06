import { InvalidParamError } from '$/presentation/errors/invalid-param-error'
import { badRequest } from '$/presentation/helpers/http/http-helpers'
import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest } from '$/presentation/protocols/http'
import { Validation } from '$/presentation/protocols/validation'
import { CreateToolsController } from './create-tools-controller'
import {
  CreateTools,
  CreateToolsParam,
} from '$/domain/usercases/tools/create-tools'
import { ToolsModel } from '$/domain/models/tools'

import faker from 'faker'

interface SutTypes {
  sut: Controller
  validationStub: Validation
  createToolsStub: CreateTools
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

const makeCreateToolsStub = (): CreateTools => {
  class CreateToolsStub implements CreateTools {
    async create(param: CreateToolsParam): Promise<ToolsModel> {
      return await Promise.resolve({
        id: faker.random.uuid(),
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
      })
    }
  }

  return new CreateToolsStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const createToolsStub = makeCreateToolsStub()
  const sut = new CreateToolsController(validationStub, createToolsStub)

  return {
    sut,
    validationStub,
    createToolsStub,
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
    const { sut, createToolsStub } = makeSut()
    const createSpy = jest.spyOn(createToolsStub, 'create')
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(createSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})