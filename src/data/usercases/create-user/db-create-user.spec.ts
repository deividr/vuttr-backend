import {
  CreateUser,
  UserParams,
} from '../../../domain/usercases/user/create-user'
import { DbCreateUser } from './db-create-user'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  dbCreateUser: CreateUser
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const dbCreateUser: CreateUser = new DbCreateUser(encrypterStub)

  return {
    dbCreateUser,
    encrypterStub,
  }
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('valid_hashed')
    }
  }

  return new EncrypterStub()
}

const makeUserParams = (): UserParams => {
  return {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  }
}

describe('Database Create User Case', () => {
  test('Should return ok when Encrypter call with correct password', async () => {
    const { dbCreateUser, encrypterStub } = makeSut()
    const spyEncrypt = jest.spyOn(encrypterStub, 'encrypt')
    const userParams = makeUserParams()

    await dbCreateUser.create(userParams)

    expect(spyEncrypt).toHaveBeenCalledWith(userParams.password)
  })

  test('Should return throw when Encrypter throw', async () => {
    const { dbCreateUser, encrypterStub } = makeSut()
    const userParams = makeUserParams()

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error())),
      )

    const promise = dbCreateUser.create(userParams)

    await expect(promise).rejects.toThrow()
  })
})
