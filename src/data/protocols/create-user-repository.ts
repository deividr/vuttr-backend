import { UserParams } from '../../domain/usercases/user/create-user'
import { User } from '../../domain/models/user'

export interface CreateUserRepository {
  add: (userParams: UserParams) => Promise<User>
}
