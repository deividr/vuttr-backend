import { CreateUserParams } from '../../../../domain/usercases/user/create-user'
import { UserModel } from '../../../../domain/models/user'

export interface CreateUserRepository {
  create: (userParams: CreateUserParams) => Promise<UserModel>
}
