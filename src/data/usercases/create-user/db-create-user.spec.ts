import {
  CreateUser,
  CreateUserParams,
} from '../../../domain/usercases/user/create-user'
import { DbCreateUser } from './db-create-user'
import { Hasher } from '../../protocols/encrypter'
import { CreateUserRepository } from '../../protocols/create-user-repository'
import { UserModel } from '../../../domain/models/user'

interface SutTypes {
  dbCreateUser: CreateUser
  hasherStub: Hasher
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const createUserRepositoryStub = makeCreateUserRespository()
  const dbCreateUser: CreateUser = new DbCreateUser(
    hasherStub,
    createUserRepositoryStub,
  )

  return {
    dbCreateUser,
    hasherStub: hasherStub,
    createUserRepositoryStub,
  }
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await Promise.resolve('valid_hashed')
    }
  }

  return new HasherStub()
}

const makeCreateUserRespository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create(userParams: CreateUserParams): Promise<UserModel> {
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

const makeUserParams = (): CreateUserParams => {
  return {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  }
}

describe('Database Create User Case', () => {
  test('Should return ok when Hasher call with correct password', async () => {
    const { dbCreateUser, hasherStub } = makeSut()
    const spyHash = jest.spyOn(hasherStub, 'hash')
    const userParams = makeUserParams()

    await dbCreateUser.create(userParams)

    expect(spyHash).toHaveBeenCalledWith(userParams.password)
  })

  test('Should return throw when Hasher throw', async () => {
    const { dbCreateUser, hasherStub } = makeSut()
    const userParams = makeUserParams()

    jest
      .spyOn(hasherStub, 'hash')
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error())),
      )

    const promise = dbCreateUser.create(userParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateUserRepository with correct values', async () => {
    const { dbCreateUser, createUserRepositoryStub } = makeSut()
    const userParams = makeUserParams()

    const createSpy = jest.spyOn(createUserRepositoryStub, 'create')

    await dbCreateUser.create(userParams)

    expect(createSpy).toHaveBeenCalledWith({
      ...userParams,
      password: 'valid_hashed',
    })
  })

  test('Should return throw when CreateUserRepository throw', async () => {
    const { dbCreateUser, createUserRepositoryStub } = makeSut()
    const userParams = makeUserParams()

    jest
      .spyOn(createUserRepositoryStub, 'create')
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
