import {
  CreateUser,
  CreateUserParams,
} from '../../../domain/usercases/user/create-user'

import { UserModel } from '../../../domain/models/user'
import { Hasher } from '../../protocols/encrypter'
import { CreateUserRepository } from '../../protocols/create-user-repository'

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async create(userParams: CreateUserParams): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(userParams.password)

    const user = await this.createUserRepository.create({
      ...userParams,
      password: hashedPassword,
    })

    return user
  }
}
