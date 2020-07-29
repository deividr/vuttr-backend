import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('Bcrypt Adapter', () => {
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
