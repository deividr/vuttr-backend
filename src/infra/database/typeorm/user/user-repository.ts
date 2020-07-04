import { CreateUserRepository } from '../../../../data/protocols/create-user-repository'
import { CreateUserParams } from '../../../../domain/usercases/user/create-user'
import { UserModel } from '../../../../domain/models/user'
import { User } from '../entities/User'

export class UserRepository implements CreateUserRepository {
  async create(createUserParams: CreateUserParams): Promise<UserModel> {
    const user = new User()

    user.name = createUserParams.name
    user.email = createUserParams.email
    user.password = createUserParams.password

    const { id } = await user.save()

    return { id, ...createUserParams }
  }
}
