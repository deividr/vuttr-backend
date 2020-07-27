import { AuthenticationModel } from '../../../../domain/models/authentication'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { HashComparer } from '../../../protocols/cryptography/hash-comparer'
import { LoadUserByEmailRepository } from '../../../protocols/db/user/load-user-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  async auth(
    authenticationParams: AuthenticationParams,
  ): Promise<AuthenticationModel | null> {
    const userModel = await this.loadUserByEmailRepository.loadUserByEmail(
      authenticationParams.email,
    )

    if (userModel) {
      const isEqual = await this.hashComparer.compare(
        authenticationParams.password,
        userModel.password,
      )
      if (isEqual) {
        return { accessToken: 'any_token', name: 'any_name' }
      }
    }

    return null
  }
}
