import { User } from '../../models/user'

export interface CreateUser {
  create: (userModel: User) => Promise<User>
}
