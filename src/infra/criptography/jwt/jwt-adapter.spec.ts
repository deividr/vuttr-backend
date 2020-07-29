import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'
import faker from 'faker'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  },
}))

const mockData = (): {} => {
  return { id: faker.random.uuid(), name: faker.name.findName() }
}

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adpater', () => {
  describe('encrypt', () => {
    test('should call method encrypt with correct values', async () => {
      const sut = makeSut()
      const encryptSpy = jest.spyOn(jwt, 'sign')
      const data = mockData()
      await sut.encrypt(data)
      expect(encryptSpy).toHaveBeenCalledWith(data, 'secret')
    })

    test('should return token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt(mockData())
      expect(accessToken).toEqual('any_token')
    })
  })
})
