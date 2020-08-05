import { DbAuthentication } from '$/data/usercases/user/authentication/db-authentication'
import { Authentication } from '$/domain/usercases/user/authentication'
import { BcryptAdapter } from '$/infra/criptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '$/infra/criptography/jwt/jwt-adapter'
import { UserRepository } from '$/infra/database/typeorm/repositories/user/user-repository'

export const makeDbAuthentication = (): Authentication => {
  const loadUserByEmailRepository = new UserRepository()
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET as string)
  return new DbAuthentication(
    loadUserByEmailRepository,
    bcryptAdapter,
    jwtAdapter,
  )
}
