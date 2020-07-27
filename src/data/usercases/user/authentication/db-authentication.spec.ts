import { UserModel } from '../../../../domain/models/user'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { LoadUserByEmailRepository } from '../../../protocols/db/user/load-user-by-email-repository'
import faker from 'faker'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: Authentication
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository
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
    async loadUserByEmail(email: string): Promise<UserModel | null> {
      return mockUserModel()
    }
  }

  return new LoadUserByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepository()
  const sut = new DbAuthentication(loadUserByEmailRepositoryStub)
  return {
    sut,
    loadUserByEmailRepositoryStub,
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
})
