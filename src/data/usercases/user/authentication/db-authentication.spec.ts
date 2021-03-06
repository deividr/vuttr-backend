import { UserModel } from '$/domain/models/user'
import {
  Authentication,
  AuthenticationParams,
} from '$/domain/usercases/user/authentication'
import { LoadUserByEmailRepository } from '$/data/protocols/db/user/load-user-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { HashComparer } from '$/data/protocols/cryptography/hash-comparer'
import { Encrypter } from '$/data/protocols/cryptography/encrypter'
import faker from 'faker'

interface SutTypes {
  sut: Authentication
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
}

const throwError = (): void => {
  throw new Error()
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(data: any): Promise<string> {
      return 'any_encrypt'
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepository()
  const hashCompareStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const sut = new DbAuthentication(
    loadUserByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
  )
  return {
    sut,
    loadUserByEmailRepositoryStub,
    hashCompareStub: hashCompareStub,
    encrypterStub,
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
      .mockRejectedValueOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call Hasher compare method with correct values', async () => {
    const { sut, loadUserByEmailRepositoryStub, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
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

  test('should return null if Hasher compare fail', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.auth(mockAuthenticationParams())
    expect(response).toBeNull()
  })

  test('should return throw if Hash compare return throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call Encrypter method with correct values', async () => {
    const { sut, loadUserByEmailRepositoryStub, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const data = await loadUserByEmailRepositoryStub.loadUserByEmail(
      'any_email',
    )
    await sut.auth(mockAuthenticationParams())
    expect(encryptSpy).toHaveBeenCalledWith({ id: data?.id, name: data?.name })
  })

  test('should return throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return an AuthenticationModel on success', async () => {
    const { sut, loadUserByEmailRepositoryStub, encrypterStub } = makeSut()
    const data = await loadUserByEmailRepositoryStub.loadUserByEmail(
      'any_email',
    )
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel?.accessToken).toEqual(
      await encrypterStub.encrypt(''),
    )
    expect(authenticationModel?.name).toEqual(data?.name)
  })
})
