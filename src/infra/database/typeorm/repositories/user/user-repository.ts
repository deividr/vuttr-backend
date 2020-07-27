import { CreateUserRepository } from '../../../../../data/protocols/db/user/create-user-repository'
import { CreateUserParams } from '../../../../../domain/usercases/user/create-user'
import { UserModel } from '../../../../../domain/models/user'
import { User } from '../../entities/User'
import { getRepository } from 'typeorm'
import { LoadUserByEmailRepository } from '../../../../../data/protocols/db/user/load-user-by-email-repository'

export class UserRepository
  implements CreateUserRepository, LoadUserByEmailRepository {
  async create({
    name,
    email,
    password,
  }: CreateUserParams): Promise<UserModel> {
    const userRepository = getRepository(User)

    const user = await userRepository.create({ name, email, password }).save()

    return user
  }

  async loadUserByEmail(email: string): Promise<UserModel | null> {
    const user = await getRepository(User)
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne()

    if (user) {
      return user
    } else {
      return null
    }
  }
}
