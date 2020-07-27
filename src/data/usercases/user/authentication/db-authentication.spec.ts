import { UserModel } from '../../../../domain/models/user'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { LoadUserByEmailRepository } from '../../../protocols/load-user-by-email-repository'
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

const makeLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadUserByEmail(email: string): Promise<UserModel | null> {
      return null
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
})
