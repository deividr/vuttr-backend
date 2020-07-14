import { CreateUserRepository } from '../../../../../data/protocols/create-user-repository'
import { CreateUserParams } from '../../../../../domain/usercases/user/create-user'
import { UserModel } from '../../../../../domain/models/user'
import { User } from '../../entities/User'
import { getRepository } from 'typeorm'

export class UserRepository implements CreateUserRepository {
  async create({
    name,
    email,
    password,
  }: CreateUserParams): Promise<UserModel> {
    const userRepository = getRepository(User)

    const user = await userRepository.create({ name, email, password }).save()

    return user
  }
}
