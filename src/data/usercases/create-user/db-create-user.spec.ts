import {
  CreateUser,
  UserParams,
} from '../../../domain/usercases/user/create-user'
import { DbCreateUser } from './db-create-user'
import { Encrypter } from '../../protocols/encrypter'
import { CreateUserRepository } from '../../protocols/create-user-repository'
import { User } from '../../../domain/models/user'

interface SutTypes {
  dbCreateUser: CreateUser
  encrypterStub: Encrypter
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const createUserRepositoryStub = makeCreateUserRespository()
  const dbCreateUser: CreateUser = new DbCreateUser(
    encrypterStub,
    createUserRepositoryStub,
  )

  return {
    dbCreateUser,
    encrypterStub,
    createUserRepositoryStub,
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

const makeCreateUserRespository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async add(userParams: UserParams): Promise<User> {
      return await Promise.resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_hashed',
      })
    }
  }

  return new CreateUserRepositoryStub()
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

  test('Should call CreateUserRepository with correct values', async () => {
    const { dbCreateUser, createUserRepositoryStub } = makeSut()
    const userParams = makeUserParams()

    const addSpy = jest.spyOn(createUserRepositoryStub, 'add')

    await dbCreateUser.create(userParams)

    expect(addSpy).toHaveBeenCalledWith({
      ...userParams,
      password: 'valid_hashed',
    })
  })

  test('Should return throw when CreateUserRepository throw', async () => {
    const { dbCreateUser, createUserRepositoryStub } = makeSut()
    const userParams = makeUserParams()

    jest
      .spyOn(createUserRepositoryStub, 'add')
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error())),
      )

    const promise = dbCreateUser.create(userParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should return User when CreateUser sucess', async () => {
    const { dbCreateUser } = makeSut()
    const userParams = makeUserParams()

    const user = await dbCreateUser.create(userParams)

    expect(user).toHaveProperty('id')
    expect(user.id).toEqual('valid_id')
    expect(user.password).toEqual('valid_hashed')
  })
})
