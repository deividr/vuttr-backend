import SignUpController from '../../../../api/controller/signup/signup-controller'
import Controller from '../../../../api/protocols/controller'
import { DbCreateUser } from '../../../../data/usercases/create-user/db-create-user'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UserRepository } from '../../../../infra/database/typeorm/repositories/user/user-repository'
import LogDecorator from '../../../decorators/log-decorator'

export default (): Controller => {
  const encrypter = new BcryptAdapter()
  const createUserRepository = new UserRepository()
  const dbCreateUser = new DbCreateUser(encrypter, createUserRepository)
  const signupController = new SignUpController(dbCreateUser)
  return new LogDecorator(signupController)
}
