import { DbCreateUser } from '$/data/usercases/user/create-user/db-create-user'
import { CreateUser } from '$/domain/usercases/user/create-user'
import { BcryptAdapter } from '$/infra/criptography/bcrypt/bcrypt-adapter'
import { UserRepository } from '$/infra/database/typeorm/repositories/user/user-repository'

export const makeDbCreateUser = (): CreateUser => {
  const encrypter = new BcryptAdapter()
  const createUserRepository = new UserRepository()
  return new DbCreateUser(encrypter, createUserRepository, createUserRepository)
}
