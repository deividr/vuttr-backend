import {
  CreateUser,
  CreateUserParams,
} from '$/domain/usercases/user/create-user'
import { DbCreateUser } from './db-create-user'
import { Hasher } from '$/data/protocols/cryptography/hasher'
import { CreateUserRepository } from '$/data/protocols/db/user/create-user-repository'
import { UserModel } from '$/domain/models/user'
import { LoadUserByEmailRepository } from '$/data/protocols/db/user/load-user-by-email-repository'
import faker from 'faker'

class CreateUserRepositoryStub implements CreateUserRepository {
  userCreated: UserModel

  async create(userParams: CreateUserParams): Promise<UserModel> {
    this.userCreated = await Promise.resolve({
      id: faker.random.uuid(),
      name: userParams.name,
      email: userParams.email,
      password: userParams.password,
    })

    return this.userCreated
  }
}

interface SutTypes {
  dbCreateUser: CreateUser
  hasherStub: Hasher
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository
  createUserRepositoryStub: CreateUserRepositoryStub
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const createUserRepositoryStub = new CreateUserRepositoryStub()
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRespository()
  const dbCreateUser: CreateUser = new DbCreateUser(
    hasherStub,
    loadUserByEmailRepositoryStub,
    createUserRepositoryStub,
  )

  return {
    dbCreateUser,
    hasherStub: hasherStub,
    loadUserByEmailRepositoryStub,
    createUserRepositoryStub,
  }
}

const makeLoadUserByEmailRespository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadUserByEmail(email: string): Promise<UserModel | null> {
      return null
    }
  }

  return new LoadUserByEmailRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await Promise.resolve('valid_hashed')
    }
  }

  return new HasherStub()
}

const mockUserParams = (): CreateUserParams => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}

const mockUser = (): UserModel => {
  return {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}

describe('Database Create User Case', () => {
  test('Should return ok when Hasher call with correct password', async () => {
    const { dbCreateUser, hasherStub } = makeSut()
    const spyHash = jest.spyOn(hasherStub, 'hash')
    const userParams = mockUserParams()

    await dbCreateUser.create(userParams)

    expect(spyHash).toHaveBeenCalledWith(userParams.password)
  })

  test('Should return throw when Hasher throw', async () => {
    const { dbCreateUser, hasherStub } = makeSut()
    const userParams = mockUserParams()

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
    const userParams = mockUserParams()

    const createSpy = jest.spyOn(createUserRepositoryStub, 'create')

    await dbCreateUser.create(userParams)

    expect(createSpy).toHaveBeenCalledWith({
      ...userParams,
      password: 'valid_hashed',
    })
  })

  test('Should return throw when CreateUserRepository throw', async () => {
    const { dbCreateUser, createUserRepositoryStub } = makeSut()
    const userParams = mockUserParams()

    jest
      .spyOn(createUserRepositoryStub, 'create')
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error())),
      )

    const promise = dbCreateUser.create(userParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should return User when CreateUser success', async () => {
    const { dbCreateUser, createUserRepositoryStub } = makeSut()
    const userParams = mockUserParams()
    const user = await dbCreateUser.create(userParams)
    expect(user).toEqual(createUserRepositoryStub.userCreated)
  })

  test('should return null if email provided already exist', async () => {
    const { dbCreateUser, loadUserByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadUserByEmailRepositoryStub, 'loadUserByEmail')
      .mockResolvedValueOnce(mockUser())

    const user = await dbCreateUser.create(mockUserParams())

    expect(user).toBeNull()
  })
})
