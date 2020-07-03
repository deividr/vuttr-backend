import {
  CreateUser,
  UserParams,
} from '../../../domain/usercases/user/create-user'

import { User } from '../../../domain/models/user'
import { Encrypter } from '../../protocols/encrypter'

export class DbCreateUser implements CreateUser {
  constructor(private readonly encrypter: Encrypter) {}

  async create(userParams: UserParams): Promise<User> {
    await this.encrypter.encrypt(userParams.password)

    return { id: 'valid_id', ...userParams }
  }
}
