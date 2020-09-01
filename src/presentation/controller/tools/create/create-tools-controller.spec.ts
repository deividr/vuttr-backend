import { Controller } from '$/presentation/protocols/controller'
import { HttpRequest } from '$/presentation/protocols/http'
import { Validation } from '$/presentation/protocols/validation'
import { CreateToolsController } from './create-tools-controller'

interface SutTypes {
  sut: Controller
  validationStub: Validation
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

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new CreateToolsController(validationStub)

  return {
    sut,
    validationStub,
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
})
