import { SignUpController } from '../../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { DbCreateUser } from '../../../../data/usercases/user/create-user/db-create-user'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UserRepository } from '../../../../infra/database/typeorm/repositories/user/user-repository'
import { SignupBodyRequestValidation } from '../../../../validation/validators/signup/body-request-validation'
import { LogDecorator } from '../../../decorators/log-decorator'

export default (): Controller => {
  const encrypter = new BcryptAdapter()
  const createUserRepository = new UserRepository()
  const dbCreateUser = new DbCreateUser(
    encrypter,
    createUserRepository,
    createUserRepository,
  )
  const validation = new SignupBodyRequestValidation()
  const signupController = new SignUpController(dbCreateUser, validation)
  return new LogDecorator(signupController)
}
