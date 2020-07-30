import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogDecorator } from '../../../decorators/log-decorator'
import { LogRepository } from '../../../../infra/database/typeorm/repositories/log/log-repository'
import { LoginBodyRequestValidation } from '../../../../validation/validators/login/login-body-request-validation'
import { DbAuthentication } from '../../../../data/usercases/user/authentication/db-authentication'
import { UserRepository } from '../../../../infra/database/typeorm/repositories/user/user-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt/jwt-adapter'

export default (): Controller => {
  const loadUserByEmailRepository = new UserRepository()
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET as string)
  const dbAuthentication = new DbAuthentication(
    loadUserByEmailRepository,
    bcryptAdapter,
    jwtAdapter,
  )
  const validation = new LoginBodyRequestValidation()
  const loginController = new LoginController(validation, dbAuthentication)
  const logErrorRepository = new LogRepository()
  return new LogDecorator(loginController, logErrorRepository)
}
