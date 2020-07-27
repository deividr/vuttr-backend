import { UserModel } from '../../../../domain/models/user'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { LoadUserByEmailRepository } from '../../../protocols/db/user/load-user-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { HashComparer } from '../../../protocols/cryptography/hash-comparer'
import faker from 'faker'

interface SutTypes {
  sut: Authentication
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository
  hashComparerStub: HashComparer
}

const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})

const mockUserModel = (): UserModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

const makeLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    userModel: UserModel
    constructor() {
      this.userModel = mockUserModel()
    }

    async loadUserByEmail(email: string): Promise<UserModel | null> {
      return this.userModel
    }
  }

  return new LoadUserByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(plainText: string, digest: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const sut = new DbAuthentication(
    loadUserByEmailRepositoryStub,
    hashComparerStub,
  )
  return {
    sut,
    loadUserByEmailRepositoryStub,
    hashComparerStub,
  }
}

describe('Database Authentication User', () => {
  test('should call LoadUserByEmail method with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const loadUserByEmailSpy = jest.spyOn(
      loadUserByEmailRepositoryStub,
      'loadUserByEmail',
    )
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadUserByEmailSpy).toHaveBeenCalledWith(authenticationParams.email)
  })

  test('should return null if LoadUserByEmailRepository return null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailRepositoryStub, 'loadUserByEmail')
      .mockResolvedValueOnce(null)
    const response = await sut.auth(mockAuthenticationParams())
    expect(response).toBeNull()
  })

  test('should throw if LoadUserByEmailRepository throws', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailRepositoryStub, 'loadUserByEmail')
      .mockRejectedValueOnce(() => {
        throw new Error()
      })
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call Hasher compare method with correct values', async () => {
    const { sut, loadUserByEmailRepositoryStub, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const authenticationParams = mockAuthenticationParams()
    const userModel = await loadUserByEmailRepositoryStub.loadUserByEmail(
      'any_email',
    )
    await sut.auth(authenticationParams)
    expect(compareSpy).toHaveBeenCalledWith(
      authenticationParams.password,
      userModel?.password,
    )
  })
})
