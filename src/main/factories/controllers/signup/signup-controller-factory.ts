import SignUpController from '../../../../api/controller/signup-controller'
import { DbCreateUser } from '../../../../data/usercases/create-user/db-create-user'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UserRepository } from '../../../../infra/database/typeorm/repositories/user/user-repository'

export default (): SignUpController => {
  const encrypter = new BcryptAdapter()
  const createUserRepository = new UserRepository()
  const dbCreateUser = new DbCreateUser(encrypter, createUserRepository)
  return new SignUpController(dbCreateUser)
}
