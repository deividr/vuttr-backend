import {
  CreateUser,
  CreateUserParams,
} from '../../../domain/usercases/user/create-user'

import { UserModel } from '../../../domain/models/user'
import { Encrypter } from '../../protocols/encrypter'
import { CreateUserRepository } from '../../protocols/create-user-repository'

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async create(userParams: CreateUserParams): Promise<UserModel> {
    const hashedPassoword = await this.encrypter.encrypt(userParams.password)

    const user = await this.createUserRepository.add({
      ...userParams,
      password: hashedPassoword,
    })

    return user
  }
}
