import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  },
}))

describe('Jwt Adpater', () => {
  describe('encrypt', () => {
    test('should call method encrypt with correct values', async () => {
      const sut = new JwtAdapter('secret')
      const encryptSpy = jest.spyOn(jwt, 'sign')
      const data = { id: 'any_id', name: 'any_name' }
      await sut.encrypt(data)
      expect(encryptSpy).toHaveBeenCalledWith(data, 'secret')
    })
  })
})
