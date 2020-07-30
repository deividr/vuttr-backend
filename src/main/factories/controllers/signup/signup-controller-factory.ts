import { SignUpController } from '../../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { DbCreateUser } from '../../../../data/usercases/user/create-user/db-create-user'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UserRepository } from '../../../../infra/database/typeorm/repositories/user/user-repository'
import { LogRepository } from '../../../../infra/database/typeorm/repositories/log/log-repository'
import { SignupBodyRequestValidation } from '../../../../validation/validators/signup/body-request-validation'
import { LogDecorator } from '../../../decorators/log-decorator'
import { DbAuthentication } from '../../../../data/usercases/user/authentication/db-authentication'
import { JwtAdapter } from '../../../../infra/criptography/jwt/jwt-adapter'

export default (): Controller => {
  const encrypter = new BcryptAdapter()
  const createUserRepository = new UserRepository()
  const dbCreateUser = new DbCreateUser(
    encrypter,
    createUserRepository,
    createUserRepository,
  )
  const validation = new SignupBodyRequestValidation()
  const loadUserByEmailRepository = new UserRepository()
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET as string)
  const dbAuthentication = new DbAuthentication(
    loadUserByEmailRepository,
    bcryptAdapter,
    jwtAdapter,
  )
  const signupController = new SignUpController(
    dbCreateUser,
    validation,
    dbAuthentication,
  )
  const logRepository = new LogRepository()
  return new LogDecorator(signupController, logRepository)
}
