import { AuthenticationModel } from '../../../../domain/models/authentication'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { LoadUserByEmailRepository } from '../../../protocols/load-user-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
  ) {}

  async auth(
    authenticationParams: AuthenticationParams,
  ): Promise<AuthenticationModel | null> {
    await this.loadUserByEmailRepository.loadUserByEmail(
      authenticationParams.email,
    )
    return null
  }
}
