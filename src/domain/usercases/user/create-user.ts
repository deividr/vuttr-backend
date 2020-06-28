import { User } from '../../models/user'

export interface ICreateUser {
  create: (userModel: User) => Promise<User>
}
