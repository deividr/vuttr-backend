import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('should call hash method with correct values', async () => {
      const sut = new BcryptAdapter()
      const spyHash = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_values')
      expect(spyHash).toHaveBeenCalledWith('any_values', 12)
    })

    test('should return throw if BcryptAdapter throw', async () => {
      const sut = new BcryptAdapter()
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce(Promise.reject(new Error()))
      const promise = sut.hash('valid_password')
      await expect(promise).rejects.toThrow()
    })

    test('should hash method return hashed value', async () => {
      const sut = new BcryptAdapter()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
        return 'hashed_values'
      })
      const hashed = await sut.hash('valid_password')
      expect(hashed).toEqual('hashed_values')
    })
  })

  describe('compare()', () => {
    test('should call compare method with corret values', async () => {
      const sut = new BcryptAdapter()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('value_in', 'value_base')
      expect(compareSpy).toHaveBeenCalledWith('value_in', 'value_base')
    })

    test('should return false when compare fail', async () => {
      const sut = new BcryptAdapter()
      const result = await sut.compare('value_in', 'value_base')
      expect(result).toBeFalsy()
    })

    test('should return true when compare success', async () => {
      const sut = new BcryptAdapter()
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)
      const result = await sut.compare('value_in', 'value_base')
      expect(result).toBeTruthy()
    })
  })
})
