import { UserModel } from '$/domain/models/user'

export type CreateUserParams = Omit<UserModel, 'id'>

export interface CreateUser {
  create: (userParams: CreateUserParams) => Promise<UserModel | null>
}
