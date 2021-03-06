import {
  CreateUser,
  CreateUserParams,
} from '$/domain/usercases/user/create-user'

import { UserModel } from '$/domain/models/user'
import { Hasher } from '$/data/protocols/cryptography/hasher'
import { CreateUserRepository } from '$/data/protocols/db/user/create-user-repository'
import { LoadUserByEmailRepository } from '$/data/protocols/db/user/load-user-by-email-repository'

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async create(userParams: CreateUserParams): Promise<UserModel | null> {
    let user = await this.loadUserByEmailRepository.loadUserByEmail(
      userParams.email,
    )

    if (!user) {
      const hashedPassword = await this.hasher.hash(userParams.password)

      user = await this.createUserRepository.create({
        ...userParams,
        password: hashedPassword,
      })

      return user
    }

    return null
  }
}
