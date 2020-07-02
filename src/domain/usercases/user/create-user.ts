import { User } from '../../models/user'

export type UserParams = Omit<User, 'id'>

export interface CreateUser {
  create: (userParams: UserParams) => Promise<User>
}
