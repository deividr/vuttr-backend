import { CreateUser } from '../../../domain/usercases/user/create-user'
import { DbCreateUser } from './db-create-user'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  dbCreateUser: CreateUser
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('valid_hashed')
    }
  }

  const encrypterStub = new EncrypterStub()
  const dbCreateUser: CreateUser = new DbCreateUser(encrypterStub)

  return {
    dbCreateUser,
    encrypterStub,
  }
}

describe('Database Create User Case', () => {
  test('Should return ok when Encrypter call with correct password', async () => {
    const { dbCreateUser, encrypterStub } = makeSut()

    const spyHasher = jest.spyOn(encrypterStub, 'encrypt')

    const userParams = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    const userReturned = await dbCreateUser.create(userParams)

    expect(spyHasher).toHaveBeenCalledWith(userParams.password)
    expect(userReturned.password).toBe('valid_hashed')
  })
})
