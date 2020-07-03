import {
  CreateUser,
  UserParams,
} from '../../../domain/usercases/user/create-user'

import { User } from '../../../domain/models/user'
import { Encrypter } from '../../protocols/encrypter'
import { CreateUserRepository } from '../../protocols/create-user-repository'

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async create(userParams: UserParams): Promise<User> {
    const hashedPassoword = await this.encrypter.encrypt(userParams.password)

    const user = await this.createUserRepository.add({
      ...userParams,
      password: hashedPassoword,
    })

    return user
  }
}
