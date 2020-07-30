import { AuthenticationModel } from '../../../../domain/models/authentication'
import {
  Authentication,
  AuthenticationParams,
} from '../../../../domain/usercases/user/authentication'
import { Encrypter } from '../../../protocols/cryptography/encrypter'
import { HashComparer } from '../../../protocols/cryptography/hash-comparer'
import { LoadUserByEmailRepository } from '../../../protocols/db/user/load-user-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
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
        const accessToken = await this.encrypter.encrypt({
          id: userModel.id,
          name: userModel.name,
        })
        return { accessToken: accessToken, name: userModel.name }
      }
    }

    return null
  }
}
