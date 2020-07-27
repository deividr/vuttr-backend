import { AuthenticationModel } from '../../../../domain/models/authentication'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { LoadUserByEmailRepository } from '../../../protocols/db/user/load-user-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
  ) {}

  async auth(
    authenticationParams: AuthenticationParams,
  ): Promise<AuthenticationModel | null> {
    const userModel = await this.loadUserByEmailRepository.loadUserByEmail(
      authenticationParams.email,
    )

    if (userModel) {
      return { accessToken: 'any_token', name: 'any_name' }
    } else {
      return null
    }
  }
}
